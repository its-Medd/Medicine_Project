import React from "react";

function GetDirection (){
    const handleDirection = () => {
    window.open(
        "https://www.google.com/maps?q=AKDITAL+Polyclinique+Intermédiaire+Laayoune",
        "_blank"
    );
    };
    return (
    <div className="mapContainer">
        <iframe
        title="google-map"
        src="https://maps.google.com/maps?q=27.1535,-13.2034&z=15&output=embed"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <button className="directionBtn" onClick={handleDirection}>
        GET DIRECTION
        </button>
    </div>
    );
}
export default GetDirection;