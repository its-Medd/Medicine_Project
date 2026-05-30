import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faPen, faTrash, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Modal from "./modal";
import Label from "./label";
import User from '../abstract-user-flat-4.png';
import "./profile.css";
import Conexion from "./conexion";
import DeleteModal from "./delete";
import AppLayout from "../Home/Laayout/hmLaayout";
import {
  deleteCurrentUser,
  fetchCurrentUser,
  logoutUser,
  updateProfileEmail,
  updateProfileName,
  updateProfilePassword,
  uploadProfilePhoto,
} from "../services/api";


export default function Profil() {
  const [userDetails, setUserDetails] = useState(null);
  const [openNameMod, setOpenNameMod] = useState(false);
  const [openEmailMod, setOpenEmailMod] = useState(false);
  const [openPassMod, setOpenPassMod] = useState(false);
  const [openDeleteMod, setOpenDeleteMod] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchCurrentUser();
        setUserDetails(data.user);
      } catch (_err) {
        window.location.href = "/login";
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleUpdateEmail = async (newEmail, currentPassword) => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setError("Enter a valid email");
      return;
    }
    try {
      const data = await updateProfileEmail({
        email: newEmail,
        currentPassword,
      });
      setUserDetails(data.user);
      setOpenEmailMod(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePassword = async (newPassword, currentPassword) => {
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      await updateProfilePassword({
        currentPassword,
        newPassword,
      });
      setOpenPassMod(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateName = async (firstName, lastName) => {
    if (!firstName || !lastName) {
      setError("Both first and last name are required");
      return;
    }
    try {
      const data = await updateProfileName({ firstName, lastName });
      setUserDetails(data.user);
      setOpenNameMod(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!userDetails) return <p>Loading...</p>;

  const handleDeleteAccount = async (currentPassword) => {
    try {
      await deleteCurrentUser(currentPassword);
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await uploadProfilePhoto(file);
      setUserDetails(data.user);
    } catch (err) {
      console.error("Error uploading photo:", err);
    }
  };


  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="pak">
        <div className="photo-container">
          {/* <img src={userDetails.photo || User} alt="Profile" className="img" /> */}
          <img
            src={userDetails.photo || User}
            alt="Profile"
            className="img"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '50%',
              display: 'block'
            }}
            onError={(e) => { e.target.src = User; }}
          />        
          <label htmlFor="photoInput" className="photomodif"style={{background:"#17d4b8"}}>
            <FontAwesomeIcon icon={faPen} style={{ color: "white", background: "#17d4b8" }} />
          </label>
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>

        <p className="name">{userDetails.firstName}</p>
        <label className="labeles">PERSONAL DETAILL :</label>

        <Label
          label="Full name"
          con={<FontAwesomeIcon icon={faUser} style={{ color: "#17d4b8" }} />}
          valeur={`${userDetails.firstName} ${userDetails.lastName}`}
          className="fullname"
          type="text"
          click={() => setOpenNameMod(true)}
        />

        <Label
          label="Email"
          con={<FontAwesomeIcon icon={faEnvelope} style={{ color: "#17d4b8" }} />}
          valeur={userDetails.email}
          className="email"
          type="email"
          click={() => setOpenEmailMod(true)}
        />

        <Label
          label="Password"
          con={<FontAwesomeIcon icon={faLock} style={{ color: "#17d4b8" }} />}
          valeur="••••••"
          className="password"
          type="password"
          click={() => setOpenPassMod(true)}
        />

        <Conexion
          label="CONEXION :"
          con={<FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: "#eb0c0cff" }} />}
          valeur="Logout"
          className="logout"
          click={handleLogout}
        />

        <Conexion
          label="UNSUBSCRIBE :"
          con={<FontAwesomeIcon icon={faTrash} />}
          valeur="Delete"
          className="delete"
          click={() => setOpenDeleteMod(true)}
        />


        <DeleteModal
          open={openDeleteMod}
          onClose={() => { setOpenDeleteMod(false); setError(""); }}
          onDelete={(currentPassword) => handleDeleteAccount(currentPassword)}
          error={error}
        />

        <Modal
          open={openNameMod}
          onClose={() => { setOpenNameMod(false); setError(""); }}
          label="First Name"
          type="text"
          label2="Last Name"
          type2="text"
          valeur1={userDetails.firstName}
          valeur2={userDetails.lastName}
          onSubmit={(first, last) => handleUpdateName(first, last)}
          error={error}
        />

        <Modal
          open={openEmailMod}
          onClose={() => { setOpenEmailMod(false); setError(""); }}
          label="Password"
          type="password"
          label2="New Email"
          type2="email"
          onSubmit={(currentPass, newEmail) => handleUpdateEmail(newEmail, currentPass)}
          error={error}
        />

        <Modal
          open={openPassMod}
          onClose={() => { setOpenPassMod(false); setError(""); }}
          label=" Password"
          type="password"
          label2="New Password"
          type2="password"
          onSubmit={(currentPass, newPass) => handleUpdatePassword(newPass, currentPass)}
          error={error}
        />



      </div>
    </AppLayout>
  );
}
