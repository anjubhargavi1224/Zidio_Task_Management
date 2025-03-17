import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import TaskManagement from "./components/TaskManagement";
import AdminPanel from "./pages/AdminPanel";

// Function to check user role
const isAdmin = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  // return role === "admin" || role === "engineer";  // Only specific roles can access admin panel
  if (!token) return false;
  //disable the code for only specific roles to access, currently its in developer mode
  // Bypass for developers in local development
if (process.env.NODE_ENV === "development") {
  return true;
}

return role === "admin" || role === "engineer";
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
