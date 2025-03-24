import React, { useState } from 'react';
import './UpdateProfile.css'; // Import the CSS file for styling
import axios from 'axios';

const UpdateProfile = ({ onClose, userDetails = {}, onUpdate }) => {
    const [fullName, setFullName] = useState(userDetails?.fullName || "");
    const [email, setEmail] = useState(userDetails?.email || "");
    const [occupation, setOccupation] = useState(userDetails?.occupation || "");
    const [location, setLocation] = useState(userDetails?.location || "");
    const [socialLinks, setSocialLinks] = useState(userDetails?.socialLinks || "");
    const [profilePic, setProfilePic] = useState(userDetails?.profilePic || "");

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token"); // JWT in localStorage
    
            const response = await axios.put(
                "http://localhost:5000/api/auth/UpdateProfile",
                { fullName, email, occupation, location, socialLinks, profilePic },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            alert("Profile updated successfully!");
            onUpdate(response.data.user);
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert("File size should be less than 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="text-section">
                    <h1 className="title">Update Profile</h1>
                    <p className="description">Update your profile information below.</p>
                </div>
                <div className="card">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <label htmlFor="profilePic" className="fieldset-label">Profile Picture</label>
                            <input id="profilePic" type="file" accept="image/*" onChange={handleFileChange} />
                            {profilePic && <img src={profilePic} alt="Profile Preview" className="profile-preview" />}
                            
                            <label htmlFor="fullName" className="fieldset-label">Full Name</label>
                            <input id="fullName" type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            
                            <label htmlFor="email" className="fieldset-label">Email</label>
                            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            
                            <label htmlFor="occupation" className="fieldset-label">Occupation</label>
                            <input id="occupation" type="text" className="input" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                            
                            <label htmlFor="location" className="fieldset-label">Location</label>
                            <input id="location" type="text" className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
                            
                            <label htmlFor="socialLinks" className="fieldset-label">Social Links</label>
                            <input id="socialLinks" type="text" className="input" value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} />
                        </fieldset>
                    </div>
                </div>
                <div className='BTNS'>
                    <button className="btn" onClick={handleUpdate}>Update</button>
                    <button className="close-btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
