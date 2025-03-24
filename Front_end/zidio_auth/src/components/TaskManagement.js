import React, { useState, useEffect, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import UpdateProfile from './UpdateProfile'; // Import the UpdateProfile component
import { AuthContext } from "../context/AuthContextProvider";

// Function to generate Gravatar image URL based on the hashed email
const getGravatarURL = (email) => {
  const hash = md5(email.trim().toLowerCase()); // Generate MD5 hash
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const TaskManagement = () => {
  // State for managing tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeSection, setActiveSection] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [newNotifications, setNewNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const{user, setUser} = useContext(AuthContext);

  // User details state
  const [userDetails, setUserDetails] = useState(() => {
    const savedUserDetails = localStorage.getItem("userDetails");
    return savedUserDetails ? JSON.parse(savedUserDetails) : {
      fullName: "Name",
      email: "example@gmail.com",
      occupation: "Developer",
      location: "City",
      socialLinks: "LinkedIn, Twitter",
      profilePic: getGravatarURL("tejas@example.com"),
    };
  });

  const avatarURL = userDetails.profilePic;

  useEffect(() => {
    const fetchUserDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const users = await response.json();
            const loggedInUser = users.find((u) => u.email === user.email);
            console.log(user);

            if (loggedInUser) {
                setUserDetails(loggedInUser);
                localStorage.setItem("userDetails", JSON.stringify(loggedInUser));
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    fetchUserDetails();
}, []);




  // State for handling new task input fields
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress",
  });

  // State for editing a task
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Load notifications from localStorage
  useEffect(() => {
    const userId = userDetails.email; // Assuming user ID is based on email for simplicity
    const savedNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`)) || [];
    setNotifications(savedNotifications);
    setNewNotifications(savedNotifications.length);
  }, [userDetails.email]);

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
      const task = { id: Date.now(), ...newTask };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setNewTask({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "inProgress",
      });
      setShowForm(false);

      // Notify the user about the new task
      addNotification(`A new task "${newTask.title}" has been assigned to you.`);
    }
  };

  // Delete a task based on its ID
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
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
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...editedTask } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditingTaskId(null);
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
    const completedTask = tasks.find((task) => task.id === taskId);
    if (completedTask) {
      addNotification(`Task "${completedTask.title}" has been completed!`); // Notify user
    }
  };

  const clearNotifications = () => {
    const userId = userDetails.email; // Assuming user ID is based on email for simplicity
    localStorage.removeItem(`notifications_${userId}`);
    setNotifications([]);
    setNewNotifications(0);
    setShowNotifications(false);
  };

  const addNotification = (message) => {
    const userId = userDetails.email; // Assuming user ID is based on email for simplicity
    const userNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`)) || [];
    userNotifications.push(message);
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(userNotifications));
    setNotifications(userNotifications);
    setNewNotifications(userNotifications.length);
  };

  // Calculate completed and pending counts
  const completedCount = tasks.filter(task => task.status === "completed").length;
  const pendingCount = tasks.filter(task => task.status !== "completed").length;

  // Function to update user details
  const updateUserDetails = (updatedDetails) => {
    setUserDetails(updatedDetails);
    localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
  };

  // Logout function (Replace with actual logout functionality)
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove stored JWT token
    localStorage.removeItem("userRole"); // Remove role if stored

    // Redirect to login page and clear history to prevent going back
    window.location.replace("/");
  };

  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]); // Run on component mount

  return (
    <div className="task-container">

      <header className="top-header">
        <h2>Task Management</h2>

        {/* Search bar */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Profile and notification section */}
        <div className="profile-section">
          <div className="notification-container">
            {/* Notification Bell Icon */}
            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
              🔔 {newNotifications > 0 && <span className="notification-badge">{newNotifications}</span>}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((note, index) => (
                    <div key={index} className="notification-item">{note}</div>
                  ))
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
                <button className="clear-btn" onClick={clearNotifications}>Clear All</button>
              </div>
            )}
          </div>

          {/* Profile image with dropdown options */}
          <div className="profile-container">
            <img
              src={avatarURL}
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
                    <button className="profile-option" onClick={handleLogout}>
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
                    
                    <p>{user?.username}</p>
                    <p>{user?.role}</p>
                    <p>{user?.email}</p>
                    <p>{user?.occupation}</p>
                    <p>{user?.location}</p>
                    <p>{user?.socialLinks}</p>
                    
                
                    <button
                      className="update-btn"
                      onClick={() => setShowUpdateProfile(true)}
                    >
                      Update Profile
                    </button>
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
      {/* Sidebar with task filters */}
      <aside className="sidebar">
        <div className="user-greeting">
          <h3>Hello,</h3>
          <h3>Welcome</h3>
        </div>
        <div className="User -details">
          <p>Manage All Your Task In One Place</p>
        </div>
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

        {/* RadialBarChart */}
        <div className="chart-container">
          <RadialBarChart
            width={150}
            height={150}
            innerRadius="50%"
            outerRadius="90%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar minAngle={15} background clockWise dataKey="value" />
            <Tooltip />
          </RadialBarChart>
        </div>
        {/* Display Completed and Pending Counts */}
        <div className="task-summary">
          <div className="summary-item">
            <span className="summary-label-com">Completed:</span>
            <span className="summary-value-com">{completedCount}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label-pen">Pending:</span>
            <span className="summary-value-pen">{pendingCount}</span>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="main-content">

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

        {/* Render UpdateProfile component */}
        {showUpdateProfile && (
          <UpdateProfile
            onClose={() => setShowUpdateProfile(false)}
            userDetails={userDetails}
            onUpdate={updateUserDetails}
          />
        )}

        {/* Display Tasks */}
        <div className="task-grid">
          {tasks
            .filter(task =>
              (activeSection === "all" || task.status === activeSection) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((task) => (
              <div key={task.id} className="task-card">
                {editingTaskId === task.id ? (
                  <>
                    <input type="text" name="title" value={editedTask.title} onChange={handleEditChange} />
                    <textarea name="description" value={editedTask.description} onChange={handleEditChange} />
                    <input type="date" name="startDate" value={editedTask.startDate} onChange={handleEditChange} />
                    <input type="date" name="endDate" value={editedTask.endDate} onChange={handleEditChange} />
                    <div className="task-actions">
                      <FaSave className="save-icon" onClick={() => saveEdit(task.id)} />
                      <button className="cancel-btn" onClick={() => setEditingTaskId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Title: {task.title}</h3>
                    <p>Description: {task.description}</p>
                    <p className="task-date">Start: {task.startDate} | End: {task.endDate}</p>
                    <div className="task-actions">
                      <FaEdit className="edit-icon" onClick={() => startEditing(task)} />
                      <FaTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
                      {task.status !== "completed" && (
                        <button className="complete-btn" onClick={() => completeTask(task.id)}>
                          <FaCheck className="complete-icon" /> Complete
                        </button>
                      )}
                    </div>
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