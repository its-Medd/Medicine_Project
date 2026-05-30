import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronDown, CloudUpload, Calendar } from 'lucide-react';
import { toast } from "react-toastify";
import { createMedicine, deleteMedicine, updateMedicine } from "../services/api";
import './NewMeds.css';

const DEFAULT_TIMES = {
    morning: "08:00",
    afternoon: "13:00",
    night: "20:00",
};

const DEFAULT_FORM_DATA = {
    name: "",
    type: "pill",
    dosage: "",
    quantity: "",
    whenEat: "",
    startDate: new Date().toISOString().slice(0, 10),
    durationDays: "1",
};

function buildFormState(initialData) {
    if (!initialData) {
        return {
            alarmOn: true,
            notifOn: false,
            eatTimes: {
                morning: false,
                afternoon: false,
                night: true,
            },
            timeValues: { ...DEFAULT_TIMES },
            formData: { ...DEFAULT_FORM_DATA },
        };
    }

    const eatTimes = {
        morning: false,
        afternoon: false,
        night: false,
    };
    const timeValues = { ...DEFAULT_TIMES };

    initialData.times?.forEach((timeItem) => {
        if (timeItem.slot && timeValues[timeItem.slot] !== undefined) {
            eatTimes[timeItem.slot] = true;
            timeValues[timeItem.slot] = timeItem.time;
        }
    });

    return {
        alarmOn: Boolean(initialData.alarmOn),
        notifOn: Boolean(initialData.notifOn),
        eatTimes,
        timeValues,
        formData: {
            name: initialData.name || "",
            type: initialData.type || "pill",
            dosage: initialData.dosage || "",
            quantity: initialData.quantity || "",
            whenEat: initialData.whenEat || "",
            startDate: initialData.startDate || DEFAULT_FORM_DATA.startDate,
            durationDays: String(initialData.durationDays || 1),
        },
    };
}

export default function AddMedicine({ onBack, onSaved, onDeleted, initialData }) {
    const initialState = buildFormState(initialData);
    const [alarmOn, setAlarmOn] = useState(initialState.alarmOn);
    const [notifOn, setNotifOn] = useState(initialState.notifOn);
    const [eatTimes, setEatTimes] = useState(initialState.eatTimes);
    const [timeValues, setTimeValues] = useState(initialState.timeValues);
    const [formData, setFormData] = useState(initialState.formData);
    const [imageFile, setImageFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef(null);
    const isEditMode = Boolean(initialData?.id);

    useEffect(() => {
        const nextState = buildFormState(initialData);
        setAlarmOn(nextState.alarmOn);
        setNotifOn(nextState.notifOn);
        setEatTimes(nextState.eatTimes);
        setTimeValues(nextState.timeValues);
        setFormData(nextState.formData);
        setImageFile(null);
    }, [initialData]);

    const toggleTime = (time) => {
        setEatTimes((prev) => ({ ...prev, [time]: !prev[time] }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTimeChange = (slot, value) => {
        setTimeValues((prev) => ({ ...prev, [slot]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setImageFile(file);
    };

    const buildPayload = () => {
        const selectedTimes = Object.entries(eatTimes)
            .filter(([, enabled]) => enabled)
            .map(([slot]) => ({
                slot,
                time: timeValues[slot],
            }));

        return {
            selectedTimes,
            payload: {
                ...formData,
                times: selectedTimes,
                alarmOn,
                notifOn,
                image: imageFile,
            },
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { selectedTimes, payload } = buildPayload();

        if (!formData.name || !formData.quantity || !formData.startDate) {
            toast.error("Please fill in the required medicine fields.", {
                position: "top-center",
            });
            return;
        }

        if (selectedTimes.length === 0) {
            toast.error("Select at least one medicine time.", {
                position: "top-center",
            });
            return;
        }

        try {
            setIsSaving(true);
            const response = isEditMode
                ? await updateMedicine(initialData.id, payload)
                : await createMedicine(payload);

            toast.success(
                isEditMode ? "Medicine updated successfully." : "Medicine added successfully.",
                {
                    position: "top-center",
                }
            );

            onSaved?.(response.medicine);
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData?.id) {
            return;
        }

        const confirmed = window.confirm(`Delete ${initialData.name}?`);

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteMedicine(initialData.id);
            toast.success("Medicine deleted successfully.", {
                position: "top-center",
            });
            onDeleted?.(initialData.id);
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="add-med-page">
            <div className="add-med-container">
                <div className="add-med-header">
                    <button className="back-btn" onClick={onBack} type="button">
                        <ChevronLeft size={24} color="#666" />
                    </button>
                    <h1 className="page-title">
                        {isEditMode ? "Update Medicine" : "Add New Medicine"}
                    </h1>
                </div>
                <p className="page-subtitle">
                    {isEditMode
                        ? "Update the medicine details and keep reminders in sync."
                        : "Fill out the fields and save to add your medicine to the home page."}
                </p>

                <form className="add-med-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name (e.g Ibuprofen)"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Type*</label>
                            <div className="select-wrapper">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="form-input select-input"
                                >
                                    <option value="pill">Pill</option>
                                    <option value="capsule">Capsule</option>
                                    <option value="syrup">Syrup</option>
                                    <option value="injection">Injection</option>
                                </select>
                                <ChevronDown className="select-icon" size={20} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Dosage</label>
                            <input
                                type="text"
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleInputChange}
                                placeholder="250mg"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Quantity*</label>
                            <input
                                type="text"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="e.g 2 pills"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Duration (days)*</label>
                            <input
                                type="number"
                                name="durationDays"
                                value={formData.durationDays}
                                onChange={handleInputChange}
                                min="1"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

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

                                        {isChecked && (
                                            <div className="time-input-wrapper">
                                                <Calendar size={18} className="time-icon" />
                                                <input
                                                    type="time"
                                                    value={timeValues[key]}
                                                    onChange={(event) => handleTimeChange(key, event.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>When Eat</label>
                        <input
                            type="text"
                            name="whenEat"
                            value={formData.whenEat}
                            onChange={handleInputChange}
                            placeholder="Before / During / After food"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Medicine picture</label>
                        <div className="upload-box">
                            <CloudUpload size={32} color="#666" strokeWidth={1.5} />
                            <p className="upload-text">
                                {imageFile
                                    ? imageFile.name
                                    : initialData?.image
                                        ? "Current image saved. Choose another file to replace it."
                                        : "Choose an image for this medicine"}
                            </p>
                            <p className="upload-subtext">JPEG, PNG or JPG, up to 5MB</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleImageChange}
                                className="hidden-file-input"
                            />
                            <button
                                className="browse-btn"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Browse File
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reminder*</label>
                        <p className="sub-label">Start date:</p>
                        <div className="date-input-wrapper">
                            <Calendar size={20} className="input-icon" color="#999" />
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="form-input with-icon"
                                required
                            />
                        </div>
                    </div>

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
                            <span className={`toggle-label ${notifOn ? 'active-text' : ''}`}>Turn on Notifications</span>
                            <div
                                className={`toggle-switch ${notifOn ? 'on' : 'off'}`}
                                onClick={() => setNotifOn(!notifOn)}
                            >
                                <div className="toggle-circle"></div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="save-btn-large" disabled={isSaving}>
                            {isSaving ? "Saving..." : isEditMode ? "Update Medicine" : "Save"}
                        </button>

                        {isEditMode && (
                            <button
                                className="delete-btn-large"
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Medicine"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
