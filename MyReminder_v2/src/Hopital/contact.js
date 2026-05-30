import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

function Contact({ contactInfo }) {
    return (
        <div className="contactContainer">
            <div className="contact">
                <div className="contact-item">
                    <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                    <span className="contact-text">{contactInfo.email}</span>
                </div>

                <div className="contact-item">
                    <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                    <span className="contact-text">{contactInfo.phone}</span>
                </div>

                <div className="contact-item">
                    <FontAwesomeIcon icon={faLocationDot} className="contact-icon" />
                    <span className="contact-text">{contactInfo.location}</span>
                </div>
            </div>
        </div>
    );
}

export default Contact;
