import React, { useState } from "react";
import "./modal.css";

export default function DeleteModal({ open, onClose, onDelete, error }) {
    const [password, setPassword] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!password) return;
        onDelete(password); 
        setPassword("");
    };

    return (
        <div className="page">
            <div className="cont">
                <button className="close" onClick={onClose}>×</button>
                <label className="label">Password</label>
                <div className="p">
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
                <button className="ok" onClick={handleSubmit} style={{ background: "red"}}>Delete Account</button>
            </div>
        </div>
    );
}
