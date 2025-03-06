import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]); 
  const [activeSection, setActiveSection] = useState("all"); // Track selected section

  // Add new task
  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: "Title",
      description: "Description",
      dateTime: "Date & Time",
      status: "all", // Default status
    };
    setTasks([...tasks, newTask]);
  };

  // Delete task function
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Filter tasks based on active section
  const filteredTasks = tasks.filter((task) =>
    activeSection === "all" ? true : task.status === activeSection
  );

  return (
    <div className="task-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Task Management</h2>
        <button
          className={activeSection === "all" ? "active" : ""}
          onClick={() => setActiveSection("all")}
        >
          All Task
        </button>
        <button
          className={activeSection === "inProgress" ? "active" : ""}
          onClick={() => setActiveSection("inProgress")}
        >
          In Progress
        </button>
        <button
          className={activeSection === "completed" ? "active" : ""}
          onClick={() => setActiveSection("completed")}
        >
          Completed
        </button>
        <button
          className={activeSection === "todo" ? "active" : ""}
          onClick={() => setActiveSection("todo")}
        >
          To Do
        </button>
        <button
          className={activeSection === "team" ? "active" : ""}
          onClick={() => setActiveSection("team")}
        >
          Team
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search bar" />
          </div>
          <div className="profile-section">
            <span className="notification-icon">🔔</span>
            <img src="profile.png" alt="Profile" className="profile-pic" />
          </div>
        </header>

        {/* Task Grid */}
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className="task-date">{task.dateTime}</p>
              <div className="task-actions">
                <FaEdit className="edit-icon" />
                <FaTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <button className="add-task-btn" onClick={addTask}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default TaskManagement;
