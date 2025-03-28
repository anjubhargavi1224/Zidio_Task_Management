import React, { useContext, useState } from 'react';
import './UpdateProfile.css'; // Import the CSS file for styling
import { AuthContext } from "../context/AuthContextProvider";

const UpdateProfile = ({ onClose, userDetails= {}, onUpdate }) => {
    const {user,setUser} = useContext(AuthContext);
    const [username, setUserName] = useState(userDetails?.username || "");
    const [email, setEmail] = useState(userDetails?.email || "");
    const [occupation, setOccupation] = useState(userDetails?.occupation || "");
    const [location, setLocation] = useState(userDetails?.location || "");
    const [socialLinks, setSocialLinks] = useState(userDetails?.socialLinks || "");
    const [profileImage, setProfileImage] = useState(userDetails?.profileImage || "");
    
    
    const handleUpdate = async () => {
        if (!username || !email || !occupation || !location) {
            alert("Please fill out all required fields.");
            return;
        }

        const updatedDetails = {
            username,
            email,
            occupation,
            location,
            profileImage, // Send Base64 string
            socialLinks
        };
        try {
            const token = localStorage.getItem("token"); // Get JWT token
            const response = await fetch(`http://localhost:5000/auth/update-profile/${userDetails._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedDetails),
            });
    
            const data = await response.json();
           
            if (response.ok) {
                setUser(data.user); // Update user in AuthContext
                onUpdate(data.user); // Update state in TaskManagement.js
                alert("Profile updated successfully!");
                onClose();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert to Base64
            reader.onloadend = () => {
                setProfileImage(reader.result); // Store Base64 string in state
            };
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
                            {profileImage && <img src={user.profileImage} alt="Profile Preview" className="profile-preview" />}
                            
                            <label htmlFor="fullName" className="fieldset-label">Full Name</label>
                            <input id="fullName" type="text" className="input" value={username} onChange={(e) => setUserName(e.target.value)} />
                            
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
