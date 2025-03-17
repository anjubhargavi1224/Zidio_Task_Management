// Importing necessary modules and styles
import React, { useState, useEffect } from "react";
import "./AuthForm.css"; // Import external CSS for styling
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Authentication Form Component
const AuthForm = () => {
  // State variables for form inputs and UI behavior
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // Default role: user
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  // Toggle between Sign In & Sign Up modes
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  useEffect(() => {
    if (password.length === 0) {
      setShowPassword(false);
    }
  }, [password]);

  // Handles form submission for Sign In/Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email field
    if (!email.trim()) {
        alert("Email is required!");
        return;
    }

    try {
        const url = `${process.env.REACT_APP_API_URL}/auth/${isSignUp ? "register" : "login"}`;
        const payload = isSignUp ? { username: name, email, password, role } : { email, password };
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        setPopupMessage(isSignUp ? "✅ Account Created Successfully!" : "🚀 Welcome back! Let’s continue.");
        setShowPopup(true);

        // Save token & user details in localStorage
        if (!isSignUp) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.user.role);
        }

        setTimeout(() => {
          setShowPopup(false);
          if(role === "admin"){
            navigate("/admin");
          }else{
            navigate("/tasks"); // ✅ Redirect after successful authentication
          }
        }, 1000);

    } catch (error) {
        alert(error.message);
    }
};

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h2 className="auth-title">
          Zidio Task <br /> Management
        </h2>
        <div className="auth-tagline">Manage all your tasks in one place</div>
      </div>

      <div className="auth-box">
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <label className="role-label">{isSignUp ? "Register as:" : "Login as:"}</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {!isSignUp && (
            <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
              Lost password? <span>Click Here!</span>
            </p>
          )}

          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="switch-mode" onClick={toggleMode}>
          {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
        </p>
      </div>

      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
