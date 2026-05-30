const scheduledTimeouts = [];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function supportsBrowserNotifications() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermissionState() {
  if (!supportsBrowserNotifications()) {
    return "unsupported";
  }

  return window.Notification.permission;
}

export async function requestNotificationPermission() {
  if (!supportsBrowserNotifications()) {
    return "unsupported";
  }

  return window.Notification.requestPermission();
}

export function clearScheduledNotifications() {
  while (scheduledTimeouts.length > 0) {
    const timeoutId = scheduledTimeouts.pop();
    window.clearTimeout(timeoutId);
  }
}

function isMedicineActiveOnDate(medicine, date) {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  const start = new Date(`${medicine.startDate}T00:00:00`);
  const end = new Date(`${medicine.endDate}T00:00:00`);

  return current >= start && current <= end;
}

function buildReminderDate(baseDate, time) {
  const [hours = "0", minutes = "0"] = String(time).split(":");
  const reminderDate = new Date(baseDate);
  reminderDate.setHours(Number(hours), Number(minutes), 0, 0);
  return reminderDate;
}

function buildReminderEntries(medicines) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + DAY_IN_MS);
  const reminderEntries = [];

  medicines.forEach((medicine) => {
    if (!medicine.notifOn) {
      return;
    }

    const candidateDates = [now, tomorrow];

    candidateDates.forEach((candidateDate) => {
      if (!isMedicineActiveOnDate(medicine, candidateDate)) {
        return;
      }

      medicine.times.forEach((timeItem) => {
        const reminderDate = buildReminderDate(candidateDate, timeItem.time);

        if (reminderDate <= now || reminderDate.getTime() - now.getTime() > DAY_IN_MS) {
          return;
        }

        reminderEntries.push({
          id: `${medicine.id}-${candidateDate.toDateString()}-${timeItem.time}`,
          title: `Medicine reminder: ${medicine.name}`,
          body: `${medicine.quantity}${medicine.dosage ? ` • ${medicine.dosage}` : ""}${medicine.whenEat ? ` • ${medicine.whenEat}` : ""}`,
          scheduledFor: reminderDate,
        });
      });
    });
  });

  return reminderEntries.sort(
    (first, second) => first.scheduledFor.getTime() - second.scheduledFor.getTime()
  );
}

export function scheduleMedicineNotifications(medicines) {
  clearScheduledNotifications();

  if (getNotificationPermissionState() !== "granted") {
    return [];
  }

  const reminders = buildReminderEntries(medicines);

  reminders.forEach((reminder) => {
    const delay = reminder.scheduledFor.getTime() - Date.now();
    const timeoutId = window.setTimeout(() => {
      const notification = new window.Notification(reminder.title, {
        body: reminder.body,
        tag: reminder.id,
      });

      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([200, 120, 200]);
      }

      window.setTimeout(() => notification.close(), 10000);
    }, delay);

    scheduledTimeouts.push(timeoutId);
  });

  return reminders;
}
