import React from "react";
import { useNavigate } from "react-router-dom";

function HospitalCard ({ hospital }){
    const navigate = useNavigate();
    return(
    <div className="doctor-card">
        <div className="card-image-container">
        <img 
            src={hospital.image}
            alt={hospital.name} 
            className="doctor-image" 
        />
        </div>
        <div className="card-details">
            <div className="name-placeholder">{hospital.name}</div>
            <div className="detail-row"><strong>TYPE:</strong> {hospital.type}</div>
            <div className="detail-row"><strong>CITY:</strong> {hospital.city}</div>
            <div className="detail-row"><strong>PHONE NUM:</strong> {hospital.phone}</div>
            <div className="detail-row"><strong>LOCATION:</strong> {hospital.location}</div>
            <button className="map-btn" onClick={() => navigate("/page2")}>MAP LOCATION CLICK</button>
        </div>
    </div>
    )
} 
export default HospitalCard;