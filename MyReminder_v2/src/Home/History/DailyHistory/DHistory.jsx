import React from "react";
import { format } from 'date-fns';
import './DHistory.css';  // Don't forget to import CSS

export default function History({ schedules, selectedDate }) {
    const formattedDate = format(selectedDate, 'dd/MM/yyyy');
    const isToday = format(new Date(), 'dd/MM/yyyy') === formattedDate;

    const historyItems = [];

    schedules.forEach((slot) => {
        slot.medicines.forEach((medicine) => {
            historyItems.push({
                medicineName: medicine.name,
                time: slot.time,
                quantity: medicine.quantity,
                image: medicine.image,
                status: 'scheduled'
            });
        });
    });

    return (
        <div className="history-section">

            {/* Header */}
            <div className="history-header">
                <h2 className="history-title">Daily History:</h2>
                <div className="history-date">
                    {isToday ? 'Today' : format(selectedDate, 'EEEE')} - {formattedDate}
                </div>
            </div>

            {/* History List */}
            {historyItems.length > 0 ? (
                <div className="history-list">
                    {historyItems.map((item, index) => (
                        <div
                            key={index}
                            className={`history-card history-${item.status}`}
                        >

                            {/* Medicine Image */}
                            <div className="history-image">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.medicineName}
                                    />
                                ) : (
                                    <span className="medicine-icon">💊</span>
                                )}
                            </div>

                            {/* Medicine Info */}
                            <div className="history-info">
                                <div className="history-name">{item.medicineName}</div>
                                <div className="history-time">{item.time} • {item.quantity}</div>
                            </div>

                            {/* Status Badge */}
                            <div className={`history-status ${item.status}`}>
                                Scheduled
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-history">
                    <p>No medicines scheduled for this date</p>
                </div>
            )}

        </div>
    );
}
