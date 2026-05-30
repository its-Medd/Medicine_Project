import { Bell, ChevronRight, Pill } from "lucide-react";
import "./Cards.css";

export default function MedsCard(Meds) {
    return (
        <div className="MedsCard">
            <div className="MedsVisual">
                {Meds.image ? (
                    <img className="MedsImg" src={Meds.image} alt={Meds.name} />
                ) : (
                    <div className="MedsImg MedsImgPlaceholder">
                        <Pill size={28} color="white" />
                    </div>
                )}
            </div>

            <div className="MedsContent">
                <div className="MedsInfo">
                    <div className="MedsTitleRow">
                        <div className="MedsName">{Meds.name}</div>
                        {Meds.notifOn && (
                            <span className="MedsBadge">
                                <Bell size={12} />
                                Reminder on
                            </span>
                        )}
                    </div>

                    <div className="MedsDetails">
                        {Meds.dosage && <div className="MedsDosage">Dosage: {Meds.dosage}</div>}
                        <div className="MedsQuantity">Quantity: {Meds.quantity}</div>
                        {Meds.whenEat && <div className="MedsWhenEat">{Meds.whenEat}</div>}
                    </div>
                </div>

                <div className="MedsSchedule">
                    <div className="MedsSch">Schedule: {Meds.schedule}</div>
                    <div className="MedsDuration">Duration: {Meds.duration}</div>
                </div>
            </div>

            <button className="MedsBtn" onClick={Meds.onEdit} type="button">
                Edit
                <ChevronRight size={15} color="white" />
            </button>
        </div>
    );
}
