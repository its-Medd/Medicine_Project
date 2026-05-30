const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? options.headers || {}
    : {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch (_error) {
      data = { message: raw };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function fetchCurrentUser() {
  return apiRequest("/auth/me");
}

export function loginUser(payload) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

export function updateProfileName(payload) {
  return apiRequest("/users/me/name", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateProfileEmail(payload) {
  return apiRequest("/users/me/email", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateProfilePassword(payload) {
  return apiRequest("/users/me/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCurrentUser(currentPassword) {
  return apiRequest("/users/me", {
    method: "DELETE",
    body: JSON.stringify({ currentPassword }),
  });
}

export function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);

  return apiRequest("/users/me/photo", {
    method: "POST",
    body: formData,
  });
}

export function fetchMedicines() {
  return apiRequest("/medicines");
}

function buildMedicineFormData(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (key === "times") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    if (key === "image" && value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

export function createMedicine(payload) {
  return apiRequest("/medicines", {
    method: "POST",
    body: buildMedicineFormData(payload),
  });
}

export function updateMedicine(medicineId, payload) {
  return apiRequest(`/medicines/${medicineId}`, {
    method: "PUT",
    body: buildMedicineFormData(payload),
  });
}

export function deleteMedicine(medicineId) {
  return apiRequest(`/medicines/${medicineId}`, {
    method: "DELETE",
  });
}
