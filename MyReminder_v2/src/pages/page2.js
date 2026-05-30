import React, { useState } from "react";
import './page2.css';
import ImageSlider from '../Hopital/imageSlider';
import image1 from '../images/img1.jpg';
import image2 from '../images/img2.jpg';
import image3 from '../images/img3.jpeg';
import Contact from '../Hopital/contact';
import GetDirection from '../Hopital/getDirection';
import AppLayout from "../Home/Laayout/hmLaayout";

function Page2() {
  const [activeTab, setActiveTab] = useState('hospital');

  // مصفوفة الصور للسلايدر
  const imagesList = [image1, image2, image3];

  // معلومات الاتصال
  const contact = {
    id: 1,
    email: 'hostpital@akdital.ma',
    phone: '+212 5289-82222',
    location: 'Lotissement Al Wahda, Bd Med VI, Lot N° 14, Laayoune 70000'
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="App">
        {/* Tag Box */}
        <div className='tag-box-container'>
          <div className="tag-box">
            Hospital Akdital
          </div>
        </div>

        {/* Image Slider */}
        <ImageSlider images={imagesList} />

        {/* Contact Info */}
        <Contact key={contact.id} contactInfo={contact} />

        {/* Title */}
        <div className="title-container">
          <h3>Emplacement</h3>
          <div className="line"></div>
        </div>

        {/* Map / Get Direction */}
        <GetDirection />

      </div>
    </AppLayout>
  );
}

export default Page2;
