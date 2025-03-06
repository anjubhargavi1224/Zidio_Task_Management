import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./TaskManagement.css";

const TaskManagement = () => {
  // State to store tasks
  const [tasks, setTasks] = useState([]); 

  // State to track the active section (All, In Progress, Completed, etc.)
  const [activeSection, setActiveSection] = useState("all"); 

  // Function to add a new task with default values
  const addTask = () => {
    const newTask = {
      id: Date.now(), // Unique ID based on the timestamp
      title: "Title",
      description: "Description",
      dateTime: "Date & Time",
      status: "all", // Default status assigned
    };
    setTasks([...tasks, newTask]); // Append new task to the task list
  };

  // Function to delete a task by filtering out the selected task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Function to filter tasks based on the selected section (All, In Progress, Completed, etc.)
  const filteredTasks = tasks.filter((task) =>
    activeSection === "all" ? true : task.status === activeSection
  );

  return (
    <div className="task-container">
      {/* Sidebar for navigation between task sections */}
      <aside className="sidebar">
        <h2>Task Management</h2>
        {/* Buttons to filter tasks based on their status */}
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

      {/* Main content area */}
      <div className="main-content">
        {/* Top Header containing search bar and profile section */}
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

        {/* Task Grid - Displays filtered tasks as cards */}
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p className="task-date">{task.dateTime}</p>
              {/* Task action buttons - Edit and Delete */}
              <div className="task-actions">
                <FaEdit className="edit-icon" />
                <FaTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Task Button */}
        <button className="add-task-btn" onClick={addTask}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default TaskManagement;
