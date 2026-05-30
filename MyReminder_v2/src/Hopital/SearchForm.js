import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SEARCH_DOCTOR({ onSearch }) {
    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [showForm, setShowForm] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ city, type });
        setShowForm(false);
    };

    const isFormValid = city !== "" && type !== "";

    return (
        <div>

            {/* زر إعادة إظهار البحث */}
            {!showForm && (
                <button
                    className="search-toggle-btn"
                    onClick={() => setShowForm(true)}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            )}

            <form
                method="post"
                className={`search-container ${showForm ? "" : "hide"}`}
                onSubmit={handleSubmit}
            >
                <h3 className="search-title">FIND A HOSPITAL IN YOUR CITY:</h3>
                
                <select
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >
                    <option value="">CITY</option>
                    <option value="LAAYOUNE">Laayoune</option>
                    <option value="Dakhla">Dakhla</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                </select>

                <select
                    className="form-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">TYPE</option>
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="PUBLIC">PUBLIC</option>
                </select>

                <input
                    type="submit"
                    value="Search"
                    className="submit"
                    disabled={!isFormValid}
                    style={{
                        cursor: isFormValid ? "pointer" : "not-allowed",
                        opacity: isFormValid ? 1 : 0.5
                    }}
                />
            </form>
        </div>
    );
}

export default SEARCH_DOCTOR;
