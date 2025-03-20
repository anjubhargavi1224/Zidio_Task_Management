// Importing necessary modules and styles
import React, { useState, useEffect } from "react";
import "./AuthForm.css"; // Import external CSS for styling
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for better UI
import { useNavigate } from "react-router-dom";

// Authentication Form Component
const AuthForm = () => {
  // State variables for form inputs and UI behavior
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between Sign Up and Sign In mode
  const [email, setEmail] = useState(""); // Stores the email input value
  const [password, setPassword] = useState(""); // Stores the password input value
  const [name, setName] = useState(""); // Stores the name input value (only for Sign Up)
  const [role, setRole] = useState("user"); //default role : user
  const [showPassword, setShowPassword] = useState(false); // Controls password visibility toggle
  const [showPopup, setShowPopup] = useState(false); // Controls popup notification visibility
  const [popupMessage, setPopupMessage] = useState(""); // Stores popup message text

  const navigate = useNavigate(); // Initialize navigate function

  // Function to toggle between Sign In & Sign Up modes
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail(""); // Reset email field
    setPassword(""); // Reset password field
    setName(""); // Reset name field (for Sign Up)
    setShowPassword(false); // Hide password by default
  };

  // Effect hook to automatically hide password visibility when the field is empty
  useEffect(() => {
    if (password.length === 0) {
      setShowPassword(false);
    }
  }, [password]);


  // Email validation function
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());
  };
  

  // Password validation function
  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      alert("Please enter a valid email address!");
      return;
    }
  
    if (!validatePassword(password)) {
      alert("Password must include an uppercase letter, a number, and a special character.");
      return;
    }
  
    const endpoint = isSignUp ? "/auth/register" : "/auth/login";
  
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password, role }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        setPopupMessage(isSignUp ? "✅ Account Created Successfully!" : "🚀 Welcome back!");
        setShowPopup(true);
  
        setTimeout(() => {
          setShowPopup(false);
          navigate(data.user.role === "admin" ? "/admin" : "/tasks");
        }, 1000);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="auth-container">
      {/* Left Side Content with Branding */}
      <div className="auth-left">
        <h2 className="auth-title">
          Zidio Task <br />
          Management
        </h2>
        <div className="auth-tagline">Manage all your tasks in one place</div>
      </div>

      {/* Right Side Authentication Box */}
      <div className="auth-box">
        <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field (Only for Sign Up) */}
          {isSignUp && (
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Toggle Visibility */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
            {/* Toggle password visibility button */}
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Role Selection Dropdown */}
            {/* <div className="input-group">
              <label className="role-label">{isSignUp ? " Register as:" : "Login as:"}</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div> */}


          {/* Forgot Password Link (Only for Sign In Mode) */}
          {!isSignUp && (
            <p className="forgot-password">
              Lost password? <span>Click Here!</span>
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Switch Between Sign In and Sign Up */}
        <p className="switch-mode" onClick={toggleMode}>
          {isSignUp ? "Already have an account? Login" : "New user? Sign Up"}
        </p>
      </div>

      {/* Popup Notification for Feedback Messages */}
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AuthForm; // Exporting the AuthForm component
