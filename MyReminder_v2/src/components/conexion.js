import React from "react";
import "./conexion.css"

export default function Conexion({
    label,
    con,
    valeur,
    className = '',
    click 
}) {
    return (
        <div className={className}>
            <label className="label">{label}</label>
            <div>
                <span>{con}</span>
                <p className="color" onClick={click} style={{ cursor: 'pointer' }}>
                    {valeur}
                </p>
            </div>
        </div>
    );
}
