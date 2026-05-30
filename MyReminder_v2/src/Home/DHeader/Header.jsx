import React from 'react';
import "./HeaderCss.css";
import { Bell, BellOff } from 'lucide-react';

export default function Header({ UserName, notificationPermission, upcomingCount = 0, onNotificationClick }) {
    const isEnabled = notificationPermission === "granted";
    const isDenied = notificationPermission === "denied";

    return (
        <div className="headnav">
            <div>
                <p className="greet-prefix">Your wellness dashboard</p>
                <h1 className="greet">
                    Dear<span className='UserName'>{UserName || " User"}</span>
                </h1>
            </div>

            <button
                className={`NotifBtn ${isEnabled ? "enabled" : ""} ${isDenied ? "blocked" : ""}`}
                onClick={onNotificationClick}
                type="button"
                title={isEnabled ? "Notifications enabled" : "Enable notifications"}
            >
                {isDenied ? <BellOff size={20} /> : <Bell size={20} />}
                {upcomingCount > 0 && <span className="NotifCount">{upcomingCount}</span>}
            </button>
        </div>
    );
}
