const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const dataDir = path.join(__dirname, "data");
const uploadsDir = path.join(__dirname, "uploads");
const usersFile = path.join(dataDir, "users.json");
const medicinesFile = path.join(dataDir, "medicines.json");

function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]", "utf8");
  }

  if (!fs.existsSync(medicinesFile)) {
    fs.writeFileSync(medicinesFile, "[]", "utf8");
  }
}

function readUsers() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function readMedicines() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(medicinesFile, "utf8"));
}

function writeMedicines(medicines) {
  fs.writeFileSync(medicinesFile, JSON.stringify(medicines, null, 2), "utf8");
}

function buildScheduleLabel(times) {
  return `${times.length} time${times.length > 1 ? "s" : ""} per day`;
}

function buildDurationLabel(durationDays) {
  return `${durationDays} day${durationDays > 1 ? "s" : ""}`;
}

function parseMedicineTimes(rawTimes) {
  let parsedTimes;

  try {
    parsedTimes =
      typeof rawTimes === "string" ? JSON.parse(rawTimes) : rawTimes;
  } catch (_error) {
    return { error: "Medicine times are invalid" };
  }

  if (!Array.isArray(parsedTimes) || parsedTimes.length === 0) {
    return { error: "At least one medicine time is required" };
  }

  return {
    times: parsedTimes.map((timeItem) => ({
      slot: timeItem.slot,
      time: timeItem.time,
      hour: Number(String(timeItem.time).split(":")[0]),
      display: formatTimeLabel(timeItem.time),
    })),
  };
}

function normalizeMedicineInput(body, file, existingMedicine = {}) {
  const {
    name = existingMedicine.name || "",
    type = existingMedicine.type || "",
    dosage = existingMedicine.dosage || "",
    quantity = existingMedicine.quantity || "",
    whenEat = existingMedicine.whenEat || "",
    startDate = existingMedicine.startDate,
    durationDays = existingMedicine.durationDays,
    alarmOn = existingMedicine.alarmOn ?? "true",
    notifOn = existingMedicine.notifOn ?? "false",
    times = existingMedicine.times || [],
  } = body;

  if (!name || !quantity || !startDate || !durationDays || !times) {
    return {
      error:
        "Name, quantity, start date, duration, and medicine times are required",
    };
  }

  const parsedTimesResult = parseMedicineTimes(times);

  if (parsedTimesResult.error) {
    return { error: parsedTimesResult.error };
  }

  const normalizedDuration = Number(durationDays);

  if (!Number.isFinite(normalizedDuration) || normalizedDuration < 1) {
    return { error: "Duration must be at least 1 day" };
  }

  return {
    medicine: {
      ...existingMedicine,
      name: String(name).trim(),
      type: String(type).trim(),
      dosage: String(dosage).trim(),
      quantity: String(quantity).trim(),
      whenEat: String(whenEat).trim(),
      startDate,
      endDate: calculateEndDate(startDate, normalizedDuration),
      durationDays: normalizedDuration,
      times: parsedTimesResult.times,
      schedule: buildScheduleLabel(parsedTimesResult.times),
      duration: buildDurationLabel(normalizedDuration),
      alarmOn: parseBoolean(alarmOn),
      notifOn: parseBoolean(notifOn),
      image: file ? `/uploads/${file.filename}` : existingMedicine.image || "",
    },
  };
}

function findUserById(id) {
  return readUsers().find((user) => user.id === id);
}

function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return readUsers().find(
    (user) => user.email.trim().toLowerCase() === normalizedEmail
  );
}

function buildPhotoUrl(req, photo) {
  if (!photo) {
    return "";
  }

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `${req.protocol}://${req.get("host")}${photo}`;
}

function sanitizeUser(req, user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    photo: buildPhotoUrl(req, user.photo),
  };
}

function sanitizeMedicine(req, medicine) {
  return {
    id: medicine.id,
    userId: medicine.userId,
    name: medicine.name,
    type: medicine.type,
    dosage: medicine.dosage,
    quantity: medicine.quantity,
    whenEat: medicine.whenEat,
    startDate: medicine.startDate,
    endDate: medicine.endDate,
    durationDays: medicine.durationDays,
    times: medicine.times,
    schedule: medicine.schedule,
    duration: medicine.duration,
    alarmOn: medicine.alarmOn,
    notifOn: medicine.notifOn,
    image: buildPhotoUrl(req, medicine.image),
    createdAt: medicine.createdAt,
    updatedAt: medicine.updatedAt,
  };
}

function getAuthenticatedUser(req) {
  if (!req.session.userId) {
    return null;
  }

  return findUserById(req.session.userId);
}

function requireAuth(req, res, next) {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  req.user = user;
  return next();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureStorage();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeExtension = extension || ".jpg";
    cb(null, `${req.session.userId}-${Date.now()}${safeExtension}`);
  },
});

const upload = multer({ storage });

function parseBoolean(value) {
  return value === true || value === "true";
}

function formatTimeLabel(time24) {
  const [hourText = "0", minute = "00"] = String(time24).split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${minute} ${suffix}`;
}

function calculateEndDate(startDateText, durationDays) {
  const startDate = new Date(`${startDateText}T00:00:00`);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Math.max(durationDays - 1, 0));
  return endDate.toISOString().slice(0, 10);
}

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "myreminder-express-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  const { firstName, lastName = "", email, password } = req.body;

  if (!firstName || !email || !password) {
    return res
      .status(400)
      .json({ message: "First name, email, and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: "An account already exists for this email" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const users = readUsers();

  const newUser = {
    id: crypto.randomUUID(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    passwordHash,
    photo: "",
  };

  users.push(newUser);

  writeUsers(users);

  req.session.userId = newUser.id;

  return res.status(201).json({
    message: "User registered successfully",
    user: sanitizeUser(req, newUser),
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  req.session.userId = user.id;

  return res.json({
    message: "User logged in successfully",
    user: sanitizeUser(req, user),
  });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req, req.user) });
});

app.put("/api/users/me/name", requireAuth, (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "Both first name and last name are required" });
  }

  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  users[userIndex] = {
    ...users[userIndex],
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  };

  writeUsers(users);

  return res.json({
    message: "Name updated successfully",
    user: sanitizeUser(req, users[userIndex]),
  });
});

app.put("/api/users/me/email", requireAuth, async (req, res) => {
  const { email, currentPassword } = req.body;

  if (!email || !currentPassword) {
    return res
      .status(400)
      .json({ message: "New email and current password are required" });
  }

  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === req.user.id);
  const currentUser = users[userIndex];
  const normalizedEmail = email.trim().toLowerCase();
  const emailOwner = users.find(
    (user) =>
      user.email.trim().toLowerCase() === normalizedEmail &&
      user.id !== currentUser.id
  );

  if (emailOwner) {
    return res.status(409).json({ message: "This email is already in use" });
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    currentUser.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  users[userIndex] = {
    ...currentUser,
    email: email.trim(),
  };

  writeUsers(users);

  return res.json({
    message: "Email updated successfully",
    user: sanitizeUser(req, users[userIndex]),
  });
});

app.put("/api/users/me/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === req.user.id);
  const currentUser = users[userIndex];
  const passwordMatches = await bcrypt.compare(
    currentPassword,
    currentUser.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  users[userIndex] = {
    ...currentUser,
    passwordHash: await bcrypt.hash(newPassword, 10),
  };

  writeUsers(users);

  return res.json({ message: "Password updated successfully" });
});

app.delete("/api/users/me", requireAuth, async (req, res) => {
  const { currentPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: "Current password is required" });
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    req.user.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const remainingUsers = readUsers().filter((user) => user.id !== req.user.id);
  writeUsers(remainingUsers);
  writeMedicines(
    readMedicines().filter((medicine) => medicine.userId !== req.user.id)
  );

  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Account deleted successfully" });
  });
});

app.post("/api/users/me/photo", requireAuth, upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "A photo file is required" });
  }

  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  users[userIndex] = {
    ...users[userIndex],
    photo: `/uploads/${req.file.filename}`,
  };

  writeUsers(users);

  return res.json({
    message: "Photo updated successfully",
    user: sanitizeUser(req, users[userIndex]),
  });
});

app.get("/api/medicines", requireAuth, (req, res) => {
  const medicines = readMedicines()
    .filter((medicine) => medicine.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    medicines: medicines.map((medicine) => sanitizeMedicine(req, medicine)),
  });
});

app.post("/api/medicines", requireAuth, upload.single("image"), (req, res) => {
  const normalizedMedicine = normalizeMedicineInput(req.body, req.file);

  if (normalizedMedicine.error) {
    return res.status(400).json({ message: normalizedMedicine.error });
  }

  const newMedicine = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    ...normalizedMedicine.medicine,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const medicines = readMedicines();
  medicines.push(newMedicine);
  writeMedicines(medicines);

  return res.status(201).json({
    message: "Medicine added successfully",
    medicine: sanitizeMedicine(req, newMedicine),
  });
});

app.put("/api/medicines/:medicineId", requireAuth, upload.single("image"), (req, res) => {
  const medicines = readMedicines();
  const medicineIndex = medicines.findIndex(
    (medicine) =>
      medicine.id === req.params.medicineId && medicine.userId === req.user.id
  );

  if (medicineIndex === -1) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  const normalizedMedicine = normalizeMedicineInput(
    req.body,
    req.file,
    medicines[medicineIndex]
  );

  if (normalizedMedicine.error) {
    return res.status(400).json({ message: normalizedMedicine.error });
  }

  medicines[medicineIndex] = {
    ...medicines[medicineIndex],
    ...normalizedMedicine.medicine,
    updatedAt: new Date().toISOString(),
  };

  writeMedicines(medicines);

  return res.json({
    message: "Medicine updated successfully",
    medicine: sanitizeMedicine(req, medicines[medicineIndex]),
  });
});

app.delete("/api/medicines/:medicineId", requireAuth, (req, res) => {
  const medicines = readMedicines();
  const medicineToDelete = medicines.find(
    (medicine) =>
      medicine.id === req.params.medicineId && medicine.userId === req.user.id
  );

  if (!medicineToDelete) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  writeMedicines(
    medicines.filter((medicine) => medicine.id !== req.params.medicineId)
  );

  return res.json({ message: "Medicine deleted successfully" });
});

ensureStorage();

app.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
});

module.exports = app;
