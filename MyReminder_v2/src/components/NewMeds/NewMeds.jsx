import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, CloudUpload, Calendar } from 'lucide-react';
import './NewMeds.css';

export default function AddMedicine({ onBack }) {
    const [alarmOn, setAlarmOn] = useState(true);
    const [notifOn, setNotifOn] = useState(false);
    const [eatTimes, setEatTimes] = useState({
        morning: false,
        afternoon: false,
        night: true // Checked by default to match image
    });

    const toggleTime = (time) => {
        setEatTimes(prev => ({ ...prev, [time]: !prev[time] }));
    };

    return (
        <div className="add-med-page">
            <div className="add-med-container">
                
                {/* Header */}
                <div className="add-med-header">
                    <button className="back-btn" onClick={onBack}>
                        <ChevronLeft size={24} color="#666" />
                    </button>
                    <h1 className="page-title">Add New Medicine</h1>
                </div>
                <p className="page-subtitle">
                    Fill out the fields and hit the Save Button to add it!
                </p>
                <form className="add-med-form" onSubmit={(e) => e.preventDefault()}>
                    
                    {/* Name */}
                    <div className="form-group">
                        <label>Name*</label>
                        <input type="text" placeholder="Name (e.g Ibuproften)" className="form-input" />
                    </div>

                    {/* Type */}
                    <div className="form-group">
                        <label>Type*</label>
                        <div className="select-wrapper">
                            <select className="form-input select-input">
                                <option value="" disabled selected>Select Option</option>
                                <option value="pill">Pill</option>
                                <option value="syrup">Syrup</option>
                            </select>
                            <ChevronDown className="select-icon" size={20} />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label>Amount*</label>
                        <input type="text" placeholder="Dose(e.g 3)" className="form-input" />
                    </div>

                    {/* Eat Times */}
                    <div className="form-group">
                        <label>Eat Times*</label>
                        <div className="checkbox-group">
                            {['Morning', 'Afternoon', 'Night'].map((time) => {
                                const key = time.toLowerCase();
                                const isChecked = eatTimes[key];
                                return (
                                    <div key={key} className="checkbox-item-wrapper">
                                        <label className={`checkbox-label ${isChecked ? 'active-text' : ''}`}>
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked}
                                                onChange={() => toggleTime(key)}
                                            />
                                            {time}
                                        </label>
                                        
                                        {/* Conditional Time Input (Shown for 'Night' in image) */}
                                        {isChecked && (
                                            <div className="time-input-wrapper">
                                                <Calendar size={18} className="time-icon" />
                                                <input type="text" defaultValue="00:00 PM" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* When Eat */}
                    <div className="form-group">
                        <label>When Eat</label>
                        <input type="text" placeholder="Before/Middle/After of food" className="form-input" />
                    </div>

                    {/* Medicine Picture */}
                    <div className="form-group">
                        <label>Medicine picture*</label>
                        <div className="upload-box">
                            <CloudUpload size={32} color="#666" strokeWidth={1.5} />
                            <p className="upload-text">Choose an image or take it use camera here</p>
                            <p className="upload-subtext">JPEG, PNG, JPG, and HEX formats, up to 5MB</p>
                            <button className="browse-btn">Browse File</button>
                        </div>
                    </div>

                    {/* Reminder Section */}
                    <div className="form-group">
                        <label>Reminder*</label>
                        <p className="sub-label">Start date:</p>
                        <div className="date-input-wrapper">
                            <Calendar size={20} className="input-icon" color="#999"/>
                            <input type="text" placeholder="dd/mm/yyy , 00:00" className="form-input with-icon" />
                        </div>
                    </div>
                    {/* Toggles */}
                    <div className="toggles-section">
                        <div className="toggle-row">
                            <span className={`toggle-label ${alarmOn ? 'active-text' : ''}`}>Turn on Alarm</span>
                            <div 
                                className={`toggle-switch ${alarmOn ? 'on' : 'off'}`} 
                                onClick={() => setAlarmOn(!alarmOn)}
                            >
                                <div className="toggle-circle"></div>
                            </div>
                        </div>
                        <div className="toggle-row">
                            <span className="toggle-label">Turn on Notifications</span>
                            <div 
                                className={`toggle-switch ${notifOn ? 'on' : 'off'}`} 
                                onClick={() => setNotifOn(!notifOn)}
                            >
                                <div className="toggle-circle"></div>
                            </div>
                        </div>
                    </div>
                    <button className="save-btn-large">Save</button>
                </form>
            </div>
        </div>
    );
}