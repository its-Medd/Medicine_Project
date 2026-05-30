import React, { useMemo, useState } from "react";
import MedsCard from "../cardsMeds/MedsCard";
import "./Section.css"; // Ensure this imports the CSS below

export function MedsSection({ Meds, onAddNew, onEditMedicine }) {
    const [showAll, setShowAll] = useState(false);
    const visibleMeds = useMemo(() => {
        return showAll ? Meds : Meds.slice(0, 3);
    }, [Meds, showAll]);

    const hasMoreMeds = Meds.length > 3;

    return (
        <div className="MedsSection">
            {/* This Header matches the design in the image */}
            <div className="MedsHeader">
                <div className="MedsTitle">Scheduled medicine:</div>
                <button className="MedsAddBtn" onClick={onAddNew}>
                    Add new
                </button>
            </div>

            <div className="MedsContainer">
                {Meds.length > 0 ? (
                    visibleMeds.map((medicine) => (
                        <MedsCard
                            key={medicine.id}
                            {...medicine}
                            onEdit={() => onEditMedicine?.(medicine)}
                        />
                    ))
                ) : (
                    <div style={{ padding: "12px 0", color: "#666" }}>
                        No medicines added yet.
                    </div>
                )}

                {hasMoreMeds && (
                    <div style={{textAlign: 'center', marginTop: '10px'}}>
                        <button className="MoreBtn" onClick={() => setShowAll((prev) => !prev)}>
                            {showAll ? "Show Less" : `Show More (${Meds.length - visibleMeds.length})`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
