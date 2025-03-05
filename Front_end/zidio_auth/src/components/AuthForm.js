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

  // Handles form submission for Sign In/Sign Up
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email field
    if (!email.trim()) {
      alert("Email is required!");
      return;
    }

    // Set the appropriate popup message
    setPopupMessage(isSignUp ? "✅ Account Created Successfully!" : "🚀 Welcome back! Let’s continue.");
    
    // Show the popup notification
    setShowPopup(true);

    // Log the submitted credentials to the console
    console.log(isSignUp ? "Signing Up..." : "Signing In...");
    console.log({ name, email, password });

    // Redirect to Task Management Page after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
      navigate("/tasks"); // ✅ Redirect after successful authentication
    }, 3000);
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
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

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

          {/* Forgot Password Link (Only for Sign In Mode) */}
          {!isSignUp && (
            <p className="forgot-password">
              Lost password? <span>Click Here!</span>
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Switch Between Sign In and Sign Up */}
        <p className="switch-mode" onClick={toggleMode}>
          {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
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
