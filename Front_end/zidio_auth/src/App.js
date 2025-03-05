import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm"; // Importing the AuthForm component
import TaskManagement from "./components/TaskManagement"; 
import "./App.css"; // Importing global styles

// Root component of the application
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} /> {/* Login Page */}
        <Route path="/tasks" element={<TaskManagement />} /> {/* Task Management Page */}
      </Routes>
    </Router>
  );
}

export default App; // Exporting the App component as the default export
