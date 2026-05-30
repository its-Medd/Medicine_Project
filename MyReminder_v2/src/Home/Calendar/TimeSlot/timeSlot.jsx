import './timeSlot.css';
export default function Timeline({ schedules, selectedDate }) {
    const timeSlots = [
        { display: '06:00', hour: 6 },
        { display: '09:00', hour: 9 },
        { display: '12:00', hour: 12 },
        { display: '15:00', hour: 15 },
        { display: '18:00', hour: 18 },
        { display: '21:00', hour: 21 },
        { display: '23:59', hour: 24 }
    ];
    const getSchedulesForSlot = (currentHour, nextHour) => {
        return schedules.filter(schedule => {
            return schedule.hour >= currentHour && schedule.hour < nextHour;
        });
    };
    return (
        <div className="schedule-timeline-section">
            <h2 className="MedsTitle">Schedule Today:</h2>

            <div className="timeline-container">
                {timeSlots.map((slot, index) => {
                    const nextHour = timeSlots[index + 1]?.hour || 24;
                    const slotSchedules = getSchedulesForSlot(slot.hour, nextHour);

                    return (
                        <div key={slot.hour} className="timeline-slot">
                            <div className="time-label">{slot.display}</div>
                            <div className="schedule-content">
                                {slotSchedules.length > 0 ? (
                                    slotSchedules.map((schedule, idx) => (
                                        <div key={idx} className="schedule-card">
                                            <div className="medicine-list">
                                                {schedule.medicines.map((medicine, medsIdx) => (
                                                    <div key={medsIdx} className="medicine-item">
                                                        {medicine.name}
                                                        {medicine.dosage && medicine.quantity && (
                                                            <span className="medicine-details-inline">
                                {' '}({medicine.quantity})
                              </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="schedule-time">{schedule.time}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-slot"></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {schedules.length === 0 && (
                <div className="no-schedule-message">
                    <p>No medicines scheduled for this date</p>
                </div>
            )}
        </div>
    );
}

