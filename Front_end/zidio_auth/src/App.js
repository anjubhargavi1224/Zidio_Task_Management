import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContextProvider";

import AuthForm from "./components/AuthForm";
import TaskManagement from "./components/TaskManagement";
import AdminPanel from "./pages/AdminPanel";
import MeetApp from "./components/MeetApp";

// Function to check if user is an admin
const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false; // No token means not logged in

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    return decodedToken.role === "admin"; // Ensure only admins can access admin panel
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/" />; // Redirect unauthorized users
};

function App() {
  return (
    <AuthContextProvider> {/* ✅ Wrap entire app inside AuthContextProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/tasks" element={<TaskManagement />} />
          <Route path="/meet" element={<MeetApp />} /> {/* ✅ Updated to use TaskManagement for meeting */}
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
