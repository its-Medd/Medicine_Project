import SearchForm from "../Hopital/SearchForm.js";
import HospitalCard from "../Hopital/HospitalCard.js";
import React, { useState } from "react";
import './page1.css';
import Ahmed from "./images1/AHMED_KATHRADA.jpg";
import BenMehdi from "./images1/MOULAY_EL_HASSAN_BEN_MEHDI.jpeg";
import Akdital from "./images1/AKDITAL.jpeg";
import AppLayout from "../Home/Laayout/hmLaayout.jsx";


function Page1() {
  const [hospitals, setHospitals] = useState([]);
        const [activeTab, setActiveTab] = useState('hospital');
  
  const hospitalsList = [
    {
      id: 1,
      name: "MOULAY EL HASSAN BEN EL MEHDI",
      type: "PUBLIC",
      city: "LAAYOUNE",
      phone: "+212-627435023",
      location: "BLA BLA BLA",
      image:
        BenMehdi,
    },
    {
      id: 2,
      name: "AKDITAL",
      type: "PRIVATE",
      city: "LAAYOUNE",
      phone: "+212-627435024",
      location: "BLA BLA BLA",
      image:
        Akdital,
    },
    {
      id: 3,
      name: "AHMED KATHRADA",
      type: "PRIVATE",
      city: "LAAYOUNE",
      phone: "+212-627435027",
      location: "BLA BLA BLA",
      image:
        Ahmed,
    },
  ];
  const handleSearch = (searchInfo) => {
    console.log("Received data:", searchInfo);
    const filtered = hospitalsList.filter(doctor => (doctor.city === searchInfo.city && doctor.type === searchInfo.type))
    setHospitals(filtered);
  };
  return (
        <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>

    <div className="app-container">
      <header className="app-header">
        <h1>HOSPITAL CONSULTING</h1>
      </header>
      <main className="main-content">
        <SearchForm onSearch={handleSearch} />
        <div className="hospitals-list">
            {hospitals.map(hospital => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
        </div>
      </main>

       

    </div>
    </AppLayout>
  );
}

export default Page1;
