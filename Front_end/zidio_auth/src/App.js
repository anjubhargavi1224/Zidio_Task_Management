import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import TaskManagement from "./components/TaskManagement";
import AdminPanel from "./pages/AdminPanel";
import TaskSection from "./components/TaskSection";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";

// Function to check user role
const isAdmin = () => {
  const role = localStorage.getItem("userRole");

  // Bypass for developers in local development
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return role === "admin" || role === "engineer";
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  return isAdmin() ? element : <Navigate to="/" />;
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // Default: Show all tasks

  return (
    <Router>
      <div className="flex h-screen bg-gray-700">
        {/* Left Sidebar */}
        <Sidebar tasks={tasks} />

        {/* Main Task Section */}
        <div className="flex-1 p-6">
          <TaskSection tasks={tasks} setTasks={setTasks} filter={filter} />
        </div>

        {/* Right Sidebar for Task Filtering */}
        <RightSidebar setFilter={setFilter} />
      </div>

      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} />} />
      </Routes>
    </Router>
  );
};

export default App;
