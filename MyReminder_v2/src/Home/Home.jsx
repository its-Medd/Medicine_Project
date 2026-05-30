import React, { useEffect, useState } from "react";
import Header from "./DHeader/Header";
import { MedsSection } from "./SchedMed/MedsSection/MedsSection";
import Timeline from "./Calendar/TimeSlot/timeSlot";
import WCalendar from "./WeeklyCal/DaysBox/WCalendar";
import History from "./History/DailyHistory/DHistory";
import AppLayout from "./Laayout/hmLaayout";
import AddMedicine from "../NewMeds/NewMeds";
import { fetchCurrentUser, fetchMedicines } from "../services/api";
import {
    clearScheduledNotifications,
    getNotificationPermissionState,
    requestNotificationPermission,
    scheduleMedicineNotifications,
} from "../services/notifications";
import "./Home.css";

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [medicines, setMedicines] = useState([]);
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorMedicine, setEditorMedicine] = useState(null);
    const [reminderPermission, setReminderPermission] = useState(getNotificationPermissionState());
    const [scheduledReminders, setScheduledReminders] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                const [userData, medicinesData] = await Promise.all([
                    fetchCurrentUser(),
                    fetchMedicines(),
                ]);

                if (!isMounted) {
                    return;
                }

                setUserName(userData.user?.firstName || "");
                setMedicines(medicinesData.medicines || []);
            } catch (_error) {
                if (isMounted) {
                    window.location.href = "/login";
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setScheduledReminders(scheduleMedicineNotifications(medicines));

        return () => {
            clearScheduledNotifications();
        };
    }, [medicines, reminderPermission]);

    const isDateActiveForMedicine = (date, medicine) => {
        const selectedDay = new Date(date);
        selectedDay.setHours(0, 0, 0, 0);

        const startDay = new Date(`${medicine.startDate}T00:00:00`);
        const endDay = new Date(`${medicine.endDate}T00:00:00`);

        return selectedDay >= startDay && selectedDay <= endDay;
    };

    const getMeds = (date) => {
        return medicines.filter((medicine) => isDateActiveForMedicine(date, medicine));
    };

    const medsForDate = getMeds(selectedDate);

    const scheduleForDate = (() => {
        const schedule = [];

        medsForDate.forEach((medicine) => {
            medicine.times.forEach((time) => {
                schedule.push({
                    hour: time.hour,
                    time: time.display,
                    medicines: [{
                        id: medicine.id,
                        name: medicine.name,
                        dosage: medicine.dosage,
                        quantity: medicine.quantity,
                        image: medicine.image,
                    }],
                });
            });
        });

        return schedule
            .reduce((acc, item) => {
                const existing = acc.find((entry) => entry.hour === item.hour);

                if (existing) {
                    existing.medicines.push(...item.medicines);
                } else {
                    acc.push(item);
                }

                return acc;
            }, [])
            .sort((first, second) => first.hour - second.hour);
    })();

    const todayActiveCount = getMeds(new Date()).length;
    const medicinesWithNotifications = medicines.filter((medicine) => medicine.notifOn).length;

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleMedicineSaved = (medicine) => {
        setMedicines((prev) => {
            const alreadyExists = prev.some((item) => item.id === medicine.id);

            if (alreadyExists) {
                return prev.map((item) => item.id === medicine.id ? medicine : item);
            }

            return [medicine, ...prev];
        });

        setEditorMedicine(null);
        setIsEditorOpen(false);
        setSelectedDate(new Date(`${medicine.startDate}T00:00:00`));
    };

    const handleMedicineDeleted = (medicineId) => {
        setMedicines((prev) => prev.filter((medicine) => medicine.id !== medicineId));
        setEditorMedicine(null);
        setIsEditorOpen(false);
    };

    const handleNotificationClick = async () => {
        const permission = await requestNotificationPermission();
        setReminderPermission(permission);
    };

    if (isEditorOpen) {
        return (
            <AddMedicine
                onBack={() => {
                    setEditorMedicine(null);
                    setIsEditorOpen(false);
                }}
                onSaved={handleMedicineSaved}
                onDeleted={handleMedicineDeleted}
                initialData={editorMedicine}
            />
        );
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <AppLayout>
            <div className="home-shell">
                <Header
                    UserName={userName}
                    notificationPermission={reminderPermission}
                    upcomingCount={scheduledReminders.length}
                    onNotificationClick={handleNotificationClick}
                />

                <section className="home-summary">
                    <div className="summary-card summary-highlight">
                        <span className="summary-label">Today</span>
                        <strong className="summary-value">{todayActiveCount}</strong>
                        <span className="summary-hint">active medicines</span>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">Selected date</span>
                        <strong className="summary-value small">{selectedDate.toDateString()}</strong>
                        <span className="summary-hint">{medsForDate.length} medicines planned</span>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">Reminders</span>
                        <strong className="summary-value">{medicinesWithNotifications}</strong>
                        <span className="summary-hint">medicines with notifications</span>
                    </div>
                </section>

                {reminderPermission !== "granted" && (
                    <div className="notification-banner">
                        <div>
                            <strong className="notification-banner-title">Enable reminders</strong>
                            <p className="notification-banner-copy">
                                Turn on browser notifications to receive medicine reminders from your saved schedule.
                            </p>
                        </div>
                        <button className="notification-banner-btn" onClick={handleNotificationClick}>
                            {reminderPermission === "denied" ? "Check browser settings" : "Enable"}
                        </button>
                    </div>
                )}

                <MedsSection
                    Meds={medicines}
                    onAddNew={() => {
                        setEditorMedicine(null);
                        setIsEditorOpen(true);
                    }}
                    onEditMedicine={(medicine) => {
                        setEditorMedicine(medicine);
                        setIsEditorOpen(true);
                    }}
                />

                <WCalendar onDateSelect={handleDateSelect} />
                <Timeline schedules={scheduleForDate} selectedDate={selectedDate} />
                <History schedules={scheduleForDate} selectedDate={selectedDate} />
            </div>
        </AppLayout>
    );
}
