import React, { useState } from "react";
import md5 from "blueimp-md5"; // Import MD5 for hashing emails
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaCheck,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "./TaskManagement.css";
import { RadialBarChart, RadialBar, Tooltip } from "recharts";



// Function to generate Gravatar image URL based on the hashed email
const getGravatarURL = (email) => {
  const hash = md5(email.trim().toLowerCase()); // Generate MD5 hash
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const TaskManagement = () => {
  // State for managing tasks
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("all"); // Filter tasks by status
  const [showForm, setShowForm] = useState(false); // Toggle task form visibility
  const [showProfileOptions, setShowProfileOptions] = useState(false); // Toggle profile dropdown
  const [showProfile, setShowProfile] = useState(false); // Toggle profile details

  // User email (Replace with dynamic email when implementing authentication)
  const [userEmail] = useState("tejas@example.com");
  const avatarURL = getGravatarURL(userEmail); // Get user Gravatar image

  // State for handling new task input fields
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress",
  });

  // State for editing a task
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  // Handle input changes for adding a new task
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Add a new task to the task list
  const addTask = () => {
    if (
      newTask.title &&
      newTask.description &&
      newTask.startDate &&
      newTask.endDate
    ) {
      const task = { id: Date.now(), ...newTask }; // Assign unique ID using timestamp
      setTasks([...tasks, task]);
      setNewTask({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "inProgress",
      });
      setShowForm(false); // Close the form after adding task
    }
  };

  // Delete a task based on its ID
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Start editing a specific task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
    });
  };

  // Handle input changes while editing a task
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  // Save the edited task details
  const saveEdit = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...editedTask } : task
      )
    );
    setEditingTaskId(null); // Exit editing mode
  };

   // Chart data for task overview
   const data = [
    { name: "Completed", value: tasks.filter(task => task.status === "completed").length, fill: "#34D399" },
    { name: "Pending", value: tasks.filter(task => task.status !== "completed").length, fill: "#EF4444" },
  ];
  


  // Mark a task as completed
  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "completed" } : task
      )
    );
  };

  return (
    <div className="task-container">
      {/* Sidebar with task filters */}
      <aside className="sidebar">
        <button
          className={activeSection === "all" ? "active" : ""}
          onClick={() => setActiveSection("all")}
        >
          All Tasks
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

        {/**RadialBarChart */}
        <div className="chart-container">
          <RadialBarChart
            width={200}
            height={250}
            innerRadius="40%"
            outerRadius="80%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar minAngle={15} background clockWise dataKey="value" />
            <Tooltip />
          </RadialBarChart>
        </div>

      </aside>

      {/* Main content area */}
      <div className="main-content">
        <header className="top-header">
          <h2>Task Management</h2>

          {/* Search bar */}
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search bar" />
          </div>

          {/* Profile and notification section */}
          <div className="profile-section">
            <span className="notification-icon">🔔</span>

            {/* Profile image with dropdown options */}
            <div className="profile-container">
              <img
                src={avatarURL} // Gravatar image
                alt="Profile"
                className="profile-pic"
                onClick={() => setShowProfileOptions(!showProfileOptions)}
              />
              {showProfileOptions && (
                <div className="profile-dropdown">
                  {!showProfile ? (
                    <>
                      <button
                        className="profile-option"
                        onClick={() => setShowProfile(true)}
                      >
                        <FaUser /> Profile
                      </button>
                      <button className="profile-option">
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <div className="profile-card">
                      <img
                        src={avatarURL}
                        alt="Profile Pic"
                        className="profile-image"
                      />
                      <p>Full Name</p>
                      <p>{userEmail}</p>
                      <p>Occupation</p>
                      <p>Location</p>
                      <p>Social Links</p>
                      <button className="update-btn">Update Profile</button>
                      <button
                        className="back-btn"
                        onClick={() => setShowProfile(false)}
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Add Task Button */}
        {activeSection === "all" && (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            +{" "}
          </button>
        )}

        {/* Task Form Popup */}
        {showForm && (
          <div className="task-form-popup">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newTask.title}
              onChange={handleFormChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newTask.description}
              onChange={handleFormChange}
            ></textarea>
            <input
              type="date"
              name="startDate"
              value={newTask.startDate}
              onChange={handleFormChange}
            />
            <input
              type="date"
              name="endDate"
              value={newTask.endDate}
              onChange={handleFormChange}
            />
            <div className="task-form-buttons">
              <button
                className="cancel-task-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button onClick={addTask}>Add Task</button>
            </div>
          </div>
        )}

        {/* Display Tasks */}
        <div className="task-grid">
          {tasks
            .filter(
              (task) => activeSection === "all" || task.status === activeSection
            )
            .map((task) => (
              <div key={task.id} className="task-card">
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      name="title"
                      value={editedTask.title}
                      onChange={handleEditChange}
                    />
                    <textarea
                      name="description"
                      value={editedTask.description}
                      onChange={handleEditChange}
                    />
                    <input
                      type="date"
                      name="startDate"
                      value={editedTask.startDate}
                      onChange={handleEditChange}
                    />
                    <input
                      type="date"
                      name="endDate"
                      value={editedTask.endDate}
                      onChange={handleEditChange}
                    />
                    <FaSave
                      className="save-icon"
                      onClick={() => saveEdit(task.id)}
                    />
                  </>
                ) : (
                  <>
                    <h3>Title: {task.title}</h3>
                    <p>Description: {task.description}</p>
                    <p className="task-date">
                      Start: {task.startDate} | End: {task.endDate}
                    </p>
                    <FaEdit
                      className="edit-icon"
                      onClick={() => startEditing(task)}
                    />
                    <FaTrash
                      className="delete-icon"
                      onClick={() => deleteTask(task.id)}
                    />
                    {task.status !== "completed" && (
                      <button
                        className="complete-btn"
                        onClick={() => completeTask(task.id)}
                      >
                        <FaCheck className="complete-icon" /> Complete
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
