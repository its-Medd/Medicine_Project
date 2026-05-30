import React, { useState, useEffect } from "react";
import "./modal.css";

export default function Modal({ open, label, type, label2, type2, valeur1, valeur2, onClose, onSubmit, error }) {
    const [input1, setInput1] = useState(valeur1 || "");
    const [input2, setInput2] = useState(valeur2 || "");

    useEffect(() => {
        setInput1(valeur1 || "");
        setInput2(valeur2 || "");
    }, [valeur1, valeur2, open]);

    if (!open) return null;

    const handleOk = () => {
        if (label2) {
            onSubmit(input1, input2);
        } else {
            onSubmit(input1);
        }
    };

    return (
        <div className="page">
            <div className="cont">
                <button className="close" onClick={onClose}>x</button>

                <label className="label">{label}</label>
                <div className="p">
                    <input
                        type={type}
                        className="input"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                    />
                </div>

                {label2 && (
                    <>
                        <label className="label">{label2}</label>
                        <div className="p">
                            <input
                                type={type2}
                                className="input"
                                value={input2}
                                onChange={(e) => setInput2(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}

                <button className="ok" onClick={handleOk}>OK</button>
            </div>
        </div>
    );
}
