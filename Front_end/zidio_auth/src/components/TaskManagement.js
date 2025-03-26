import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../context/AuthContextProvider';

import md5 from "blueimp-md5";
import { FaSearch, FaEdit, FaTrash, FaSave, FaCheck, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UpdateProfile from './UpdateProfile';
import "./TaskManagement.css";

// Function to get the gravatar image
const getGravatarURL = (email) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Additional States (Fix for the error)
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [avatarURL, setAvatarURL] = useState(getGravatarURL("fallback@example.com"));

  useEffect(() => {
    if (userDetails?.email) {
      setAvatarURL(getGravatarURL(userDetails.email));
    }
  }, [userDetails?.email]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTasksAndUser = async () => {
      try {
        const taskRes = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(taskRes.data);

        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userRes.data;
        const profilePic = getGravatarURL(userData.email);
        setUserDetails({ ...userData, profilePic });
        localStorage.setItem("userDetails", JSON.stringify({ ...userData, profilePic }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchTasksAndUser();
  }, [navigate]);

  const addTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, res.data]);
      setNewTask({ title: "", description: "", startDate: "", endDate: "", status: "inProgress" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({ ...task });
  };

  const handleEditChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const saveEdit = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`/api/tasks/${taskId}`, editedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error saving edit:", err);
    }
  };

  // task marked for complete
  const completeTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, status: "completed" };
      const res = await axios.put(`/api/tasks/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));
      addNotification(`Task "${taskToUpdate.title}" marked as completed.`);
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  // notification button
  const addNotification = (message) => {
    const updated = [...notifications, message];
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  // notification clear
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
    setShowNotifications(false);
  };

  // update profile option
  const updateUserDetails = (updated) => {
    setUserDetails(updated);
    localStorage.setItem("userDetails", JSON.stringify(updated));
  };

  // logout option from profile
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove stored JWT token
    localStorage.removeItem("userRole"); // Remove role if stored

    // Redirect to login page and clear history to prevent going back
    window.location.replace("/"); 
  };

  

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
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <aside className="sidebar">
        <h3>Hello, Welcome</h3>
        <button className={activeSection === "all" ? "active" : ""} onClick={() => setActiveSection("all")}>
          All Tasks
        </button>
        <button className={activeSection === "inProgress" ? "active" : ""} onClick={() => setActiveSection("inProgress")}>
          In Progress
        </button>
        <button className={activeSection === "completed" ? "active" : ""} onClick={() => setActiveSection("completed")}>
          Completed
        </button>
      </aside>

      <div className="main-content">
        {activeSection === "all" && (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>+ Add Task</button>
        )}

        {showForm && (
          <div className="task-form-popup">
            <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleEditChange} />
            <textarea name="description" placeholder="Description" value={newTask.description} onChange={handleEditChange} />
            <button onClick={addTask}>Add Task</button>
          </div>
        )}

        <div className="TASK_GRID">
          {tasks
            .filter((task) => activeSection === "all" || task.status === activeSection)
            .map((task) => (
              <div key={task.id} className="TASK_CARD">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <FaEdit className="EDIT_ICON" onClick={() => startEditing(task)} />
                <FaTrash className="DELETE_ICON" onClick={() => deleteTask(task.id)} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
