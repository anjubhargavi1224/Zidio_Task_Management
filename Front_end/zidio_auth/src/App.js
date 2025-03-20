import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import TaskManagement from "./components/TaskManagement";
import AdminPanel from "./pages/AdminPanel";

// Function to check user role
const isAdmin = () => {
  const token = localStorage.getItem("token");
  if (!token) return false; // No token means not logged in

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    return decodedToken.role === "admin" || decodedToken.role === "user";
  } catch (error) {
    return false;
  }
};
// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/" />; // Redirect unauthorized users
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
      </Routes>
    </Router>
  );
}

export default App;
