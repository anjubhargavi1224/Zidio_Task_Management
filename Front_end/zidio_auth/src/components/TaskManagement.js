import React, { useState, useEffect } from "react";
import md5 from "blueimp-md5"; // Import MD5 for hashing emails
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaCheck,
  FaUser ,
  FaSignOutAlt,
} from "react-icons/fa";
import "./TaskManagement.css";
import { RadialBarChart, RadialBar, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom"; 
import UpdateProfile from './UpdateProfile'; // Import the UpdateProfile component

const getGravatarURL = (email) => {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  // const [showProfile, setShowProfile] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const{user, setUser} = useContext(AuthContext);

  // user details
  const [userDetails, setUserDetails] = useState(null);
  const [avatarURL, setAvatarURL] = useState(getGravatarURL("fallback@example.com"));
  useEffect(() => {
    if(userDetails?.email) {
      setAvatarURL(getGravatarURL(userDetails.email));
    }
  }, [userDetails?.email])

// task fields
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

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch tasks on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token, redirecting ...");
      return navigate("/");
    }
    const fetchTasksAndUser = async () => {
      try {
        // Fetch tasks
        const taskRes = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(taskRes.data);

        // Fetch logged-in user profile
        const userRes = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // TEMPORARY MOCKING FOR TESTING
        const user = userRes.data.user;
        const profilePic = getGravatarURL(user.email);
        const updatedUser = {
          fullName: user.fullName || "N/A",
          email: user.email,
          occupation: user.occupation || "N/A",
          location: user.location || "N/A",
          socialLinks: user.socialLinks || "N/A",
          profilePic,
        };

        setUserDetails(updatedUser);
        localStorage.setItem("userDetails", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchTasksAndUser();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // task add
  const addTask = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "inProgress",
      });
      setShowForm(false);
      addNotification(`A new task "${res.data.title}" has been added.`);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // delete task
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

  // edit task
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  // task save
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

  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]); // Run on component mount

  return (
    <div className="task-container">
      {/* Sidebar with task filters */}
      <aside className="sidebar">
        <div className="user-greeting">
          <h3>Hello, Welcome</h3>
        </div>
        <p>Manage All Your Task In One Place</p>
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

        <div className="chart-container">
          <RadialBarChart
            width={150}
            height={150}
            innerRadius="50%"
            outerRadius="90%"
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar minAngle={15} background clockWise dataKey="value" />
            <Tooltip />
          </RadialBarChart>
        </div>

        <div className="task-summary">
          <div>
            <span className="summary-label-com">Completed:</span>{" "}
            <span>{completedCount}</span>
          </div>
          <div>
            <span className="summary-label-pen">Pending:</span>{" "}
            <span>{pendingCount}</span>
          </div>
        </div>
      </aside>

      <div className="main-content">
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
                🔔 {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
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
                        <FaUser  /> Profile
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
                      <p>{userDetails.fullName}</p>
                      <p>{userDetails.email}</p>
                      <p>{userDetails.occupation}</p>
                      <p>{userDetails.location}</p>
                      <p>{userDetails.socialLinks}</p>
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

        {activeSection === "all" && (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            +
          </button>
        )}

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

        {showUpdateProfile && (
          <UpdateProfile
            onClose={() => setShowUpdateProfile(false)}
            userDetails={userDetails}
            onUpdate={updateUserDetails}
          />
        )}

        {/* Display Tasks */}
        <div className="TASK_GRID">
          {tasks
            .filter(
              (task) =>
                (activeSection === "all" || task.status === activeSection) &&
                task.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((task) => (
              <div key={task.id} className="TASK_CARD">
                {editingTaskId === task.id ? (
                  <>
                    <input type="text" name="title" value={editedTask.title} onChange={handleEditChange} />
                    <textarea name="description" value={editedTask.description} onChange={handleEditChange} />
                    <input type="date" name="startDate" value={editedTask.startDate} onChange={handleEditChange} />
                    <input type="date" name="endDate" value={editedTask.endDate} onChange={handleEditChange} />
                    <div className="TASK_ACTIONS">
                      <FaSave className="SAVE_ICON" onClick={() => saveEdit(task.id)} />
                      <button className="CANCEL_EDIT_BTN" onClick={() => setEditingTaskId(null)}>Cancel Edit</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Title: {task.title}</h3>
                    <p>Description: {task.description}</p>
                    <p className="TASK_DATE">Start: {task.startDate} | End: {task.endDate}</p>
                    <div className="TASK_ACTIONS">
                      <FaEdit className="EDIT_ICON" onClick={() => startEditing(task)} />
                      <FaTrash className="DELETE_ICON" onClick={() => deleteTask(task.id)} />
                      {task.status !== "completed" && (
                        <button className="COMPLETE_BTN" onClick={() => completeTask(task.id)}>
                          <FaCheck className="COMPLETE_ICON" /> Complete
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
