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

  // Email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters long and include an uppercase letter, a number, and a special character.");
      return;
    }

    setPopupMessage(isSignUp ? "✅ Account Created Successfully!" : "🚀 Welcome back! Let’s continue.");
    setShowPopup(true);

    console.log(isSignUp ? "Signing Up..." : "Logging in...");
    console.log({ name, email, password, role });

    setTimeout(() => {
      setShowPopup(false);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/tasks");
      }
    }, 2000); // Extended popup time to 2 seconds
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
