import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHouse, 
    faHospital, 
    faWallet, 
    faUser 
} from "@fortawesome/free-solid-svg-icons";

import "./BottomNav.css";

function BottomNav() {
    return (
        <div className="bottom-nav">
            <div className="nav-item">
                <FontAwesomeIcon icon={faHouse} className="nav-icon" />
                <span>Home</span>
            </div>
            <div className="nav-item active">
                <FontAwesomeIcon icon={faHospital} className="nav-icon" />
                <span>Hospital</span>
            </div>
            <div className="nav-item">
                <FontAwesomeIcon icon={faWallet} className="nav-icon" />
                <span>Repay</span>
            </div>
            <div className="nav-item">
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                <span>Profile</span>
            </div>
        </div>
    );
}

export default BottomNav;
