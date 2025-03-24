import React, { useState } from 'react';
import './UpdateProfile.css'; // Import the CSS file for styling
import axios from 'axios';

const UpdateProfile = ({ onClose, userDetails, onUpdate }) => {
    const [fullName, setFullName] = useState(userDetails.fullName);
    const [email, setEmail] = useState(userDetails.email);
    const [occupation, setOccupation] = useState(userDetails.occupation);
    const [location, setLocation] = useState(userDetails.location);
    const [socialLinks, setSocialLinks] = useState(userDetails.socialLinks);
    const [profilePic, setProfilePic] = useState(userDetails.profilePic); // State for profile picture

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result); // Set the profile picture URL
            };
            reader.readAsDataURL(file); // Convert file to base64 URL
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="text-section">
                    <h1 className="title">Update Profile</h1>
                    <p className="description">
                        Update your profile information below.
                    </p>
                </div>
                <div className="card">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <label className="fieldset-label">Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {profilePic && <img src={profilePic} alt="Profile Preview" className="profile-preview" />}
                            
                            <label className="fieldset-label">Full Name</label>
                            <input type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            
                            <label className="fieldset-label">Email</label>
                            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            
                            <label className="fieldset-label">Occupation</label>
                            <input type="text" className="input" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                            
                            <label className="fieldset-label">Location</label>
                            <input type="text" className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
                            
                            <label className="fieldset-label">Social Links</label>
                            <input type="text" className="input" value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} />
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