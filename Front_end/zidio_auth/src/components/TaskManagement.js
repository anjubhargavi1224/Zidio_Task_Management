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
  FaEye,
  // FaTimes,
  // FaCalendarDay,
  // FaLock,
  // FaThumbtack,
} from "react-icons/fa";
import "./TaskManagement.css";
import { RadialBarChart, RadialBar, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import UpdateProfile from './UpdateProfile'; // Import the UpdateProfile component
import { AuthContext } from "../context/AuthContextProvider";
import { updateTaskDetails, getTasks, createTask, createSelfTask, deleteTask, updateTaskStatus } from "../services/taskService";

import { FaCalendarAlt } from "react-icons/fa"; // Make sure react-icons is installed
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Or 'dist' if needed

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});



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
  const { user } = useContext(AuthContext);
  const [taskData, setTaskData] = useState({ title: "", description: "", startDate: "", endDate: "", assignedTo: "" });
  const API_URL = "http://localhost:5000/tasks";

  const token = localStorage.getItem("token");


  ///////////////////////////////////////////////////////////////////////////////////
  // State for task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);
  const fetchTasks = async () => {
    try {
      const response = await getTasks(token);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };
  //////////////////////////////////////////////
  //working perfectly

  const handleCreateTask = async () => {
    try {
      if (user.role === "admin") {
        await createTask(taskData, token);
      } else {
        await createSelfTask(taskData, token);
      }
      fetchTasks();
      setShowForm(false);

      // Add this line to show notification when task created:
      addNotification(`New task "${taskData.title}" has been created!`);

    } catch (error) {
      console.error("Error creating task", error);
    }
  };


  ///////////////////////////////////////////////
  //working perfectly

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId, token);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };


  //////////////////////////////////////////////////////
  // Mark a task as completed
  const completeTask = async (taskId) => {
    try {
      // Update task status in backend
      await handleUpdateStatus(taskId, "completed");

      // Optimistically update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );

      // Find completed task for notification
      const completedTask = tasks.find((task) => task._id === taskId);
      if (completedTask) {
        addNotification(`Task "${completedTask.title}" has been completed!`);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status, token);
      fetchTasks(); // Ensure tasks are updated from the backend
    } catch (error) {
      console.error("Error updating status", error);
    }
  };




  //////////////////////////////////////////////////////////////

  const handleUpdateTask = async () => {
    if (!editingTaskId) return;

    try {
      await updateTaskDetails(editingTaskId, editedTask, token);
      fetchTasks(); // Refresh task list
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task", error);
    }
  };







  //////////////////////////////////////////////////////////////////////////////

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

  const avatarURL = userDetails.profilePic;

  // State for handling new task input fields
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress",
  });

  // State for editing a task
  const [editingTaskId, setEditingTaskId] = useState(0);
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const today = new Date().toISOString().split("T")[0];

    setNewTask((prevTask) => {
      if (name === "startDate") {
        if (value < today) {
          alert("Start Date cannot be in the past!");
          return prevTask;
        }
        // Reset end date if it is before new start date
        if (prevTask.endDate && value > prevTask.endDate) {
          return { ...prevTask, startDate: value, endDate: "" };
        }
      }

      if (name === "endDate") {
        if (!prevTask.startDate) {
          alert("Please select a Start Date first!");
          return prevTask;
        }
        if (value < prevTask.startDate) {
          alert("End Date cannot be before the Start Date!");
          return prevTask;
        }
      }

      return { ...prevTask, [name]: value };
    });
  };


  // Add a new task to the task list
  const addTask = async () => {
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



  // Start editing a specific task
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


  // Handle input changes while editing a task
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save the edited task details
  const saveEdit = async (taskId) => {
    try {
      await updateTaskDetails(taskId, editedTask, token); // Send update to backend
      fetchTasks(); // Refresh tasks from backend
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error saving task", error);
    }
  };

  // Chart data for task overview
  const data = [
    { name: "Completed", value: tasks.filter(task => task.status === "completed").length, fill: "#34D399" },
    { name: "Pending", value: tasks.filter(task => task.status !== "completed").length, fill: "#EF4444" },
  ];



  const clearNotifications = () => {
    const userId = userDetails.email; // Assuming user ID is based on email for simplicity
    localStorage.removeItem(`notifications_${userId}`);
    setNotifications([]);
    setNewNotifications(0);
    setShowNotifications(false);
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message: message,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, newNotification]);
    setNewNotifications(prev => prev + 1);
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

  console.log("User Details:", userDetails);



  // State Variables
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState(false);

  // 🆕 State for new event modal
  const [newEventModalOpen, setNewEventModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
    eventType: "task",
  });

  // Handle slot selection to open new modal
  const handleSelectSlot = ({ start, end }) => {
    setNewEventData({ title: "", description: "", start, end, eventType: "task" });
    setNewEventModalOpen(true);
  };

  // Handle click on calendar event
  const handleEventClick = (event, e) => {
    setCurrentEvent(event);
    setPopupPosition({ x: e.clientX, y: e.clientY });
    setShowPopup(true);
  };

  // Open modal from popup
  const handleEditEvent = () => {
    setShowPopup(false);
    setShowModal(true);
  };

  // Save event changes
  const handleSaveEvent = () => {
    const updatedEvent = {
      ...currentEvent,
      color: currentEvent.eventType === "meeting" ? "#3b82f6" : "#34d399"
    };

    const updatedEvents = events.map((e) =>
      e.id === updatedEvent.id ? updatedEvent : e
    );
    setEvents(updatedEvents);
    setShowModal(false);
  };

  // Delete event
  const handleDeleteEvent = () => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      const updatedEvents = events.filter((e) => e.id !== currentEvent.id);
      setEvents(updatedEvents);
      setShowModal(false);
      setShowPopup(false);
    }
  };

  // Handle task click to show modal
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };


  const updateTaskProgress = (taskId, newProgress) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task._id === taskId) {
          const currentProgress = task.progress || 0;
          if (newProgress > currentProgress) {
            return {
              ...task,
              progress: parseInt(newProgress),
              status: parseInt(newProgress) === 100 ? 'completed' : task.status,
            };
          } else {
            return task; // no change if decreased
          }
        } else {
          return task;
        }
      })
    );
  };




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
          <>
            <button
              className="calendar-btnn"
              onClick={() => setShowCalendar(true)}
              title="Open Calendar"
            >
              <FaCalendarAlt size={22} />
            </button>

            {showCalendar && (
              <div className="calendar-modal">
                <div className="calendar-content">
                  <button className="close-btnn" onClick={() => setShowCalendar(false)}>X</button>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "20px" }}
                    selectable
                    popup
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={(event, e) => handleEventClick(event, e)}
                    eventPropGetter={(event) => ({
                      style: {
                        backgroundColor: event.color || '#6366f1',
                        color: 'white',
                        borderRadius: '5px',
                        border: 'none',
                        padding: '4px',
                      },
                    })}
                  />
                </div>
              </div>
            )}

            {/* 🆕 New Event Modal */}
            {newEventModalOpen && (
              <div className="modal">
                <h3>Create New Event</h3>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={newEventData.title}
                  onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                />
                <textarea
                  placeholder="Enter description"
                  value={newEventData.description}
                  onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                />
                <p><strong>Start:</strong> {new Date(newEventData.start).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric"
                })}</p>

                <label>Event Type:</label>
                <select
                  value={newEventData.eventType}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData, eventType: e.target.value })
                  }
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => {
                      const color =
                        newEventData.eventType === "meeting" ? "#3b82f6" : "#34d399";
                      const newEvent = {
                        ...newEventData,
                        id: Date.now(),
                        start: new Date(newEventData.start),
                        end: new Date(newEventData.end),
                        color
                      };
                      setEvents([...events, newEvent]);
                      setNewEventModalOpen(false);
                    }}
                  >
                    Add Event
                  </button>
                  <button onClick={() => setNewEventModalOpen(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {showModal && currentEvent && (
              <div className="modal">
                <h3>Edit Event</h3>
                <input
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                />
                <textarea
                  value={currentEvent.description || ""}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
                />
                <p><strong>Start:</strong> {new Date(currentEvent.start).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric"
                })}</p>

                <label>Event Type:</label>
                <select
                  value={currentEvent.eventType}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, eventType: e.target.value })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>

                <button onClick={handleSaveEvent}>Save Changes</button>
                <button onClick={handleDeleteEvent}>Delete Event</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            )}

            {/* Event Details Popup */}
            {currentEvent && showPopup && (
              <div
                className="event-popup"
                style={{
                  position: "absolute",
                  top: popupPosition.y + 10,
                  zIndex: 999,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3><strong>Title:</strong>{currentEvent.title}</h3>
                <p><strong>Description:</strong>{currentEvent.description}</p>
                <p><strong>Start:</strong> {new Date(currentEvent.start).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric"
                })}</p>
                <p>
                  <strong>Type:</strong>{" "}
                  <span style={{ color: currentEvent.color }}>{currentEvent.eventType}</span>
                </p>
                <div className="popup-buttons" style={{ display: "flex", gap: "10px" }}>
                  <button className="edit-btn" onClick={handleEditEvent}>Edit</button>
                  <button className="delete-btn" onClick={handleDeleteEvent}>Delete</button>
                  <button className="close-btnn" onClick={() => setShowPopup(false)}>Close</button>
                </div>
              </div>
            )}
          </>
          <div className="notification-container">
            {/* Notification Bell Icon */}
            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
              🔔 {newNotifications > 0 && <span className="notification-badge">{newNotifications}</span>}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="notification-dropdown">
                {notifications.length > 0 ? (
                  notifications.map((note) => (
                    <div key={note.id} className="notification-item">
                      {note.message}
                    </div>
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
              src={user.profileImage || "https://static.vecteezy.com/system/resources/previews/000/439/863/non_2x/vector-users-icon.jpg"}
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
                      src={user.profileImage}
                      alt="Profile Pic"
                      className="profile-image"
                    />
                    <p>{user.username}</p>
                    <p>{user.role}</p>
                    <p>{user.email}</p>
                    <p>{user.occupation}</p>
                    <p>{user.location}</p>
                    <p>{user.socialLinks}</p>
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
          className={activeSection === "in-progress" ? "active" : ""}
          onClick={() => setActiveSection("in-progress")}
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
          className="" onClick={() => navigate("/meet")}
        >
          Start your meeting
        </button>

        {/* RadialBarChart */}
        <div className="CHART-CONTAINER">
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

              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"

              onChange={handleChange}
            ></textarea>
            <input
              type="date"
              name="startDate"

              onChange={handleChange}
            />
            <input
              type="date"
              name="endDate"

              onChange={handleChange}
            />
            <div className="task-form-buttons">
              <button
                className="cancel-task-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button onClick={handleCreateTask}>Add Task</button>
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

        {showTaskModal && selectedTask && (
          <div className="task-modal-backdrop">
            <div className="task-modal-new">
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>×</button>
              <h3 className="modal-title">Task Details</h3>

              <label>Title</label>
              <input
                type="text"
                value={selectedTask.title || ""}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, title: e.target.value })
                }
                placeholder="This is a title"
                className="modal-input"
              />

              <label>Description</label>
              <textarea
                value={selectedTask.description || ""}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, description: e.target.value })
                }
                placeholder="Enter description"
                className="modal-textarea"
              />

              <div className="assignment-info">
                <p>
                  <strong>Assigned to:</strong>{" "}
                  {selectedTask.assignedTo?.length > 0 ? (
                    selectedTask.assignedTo.map((user, index) => (
                      <span key={index} className="assigned-user">{user.username}</span>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </p>
                <p>
                  <strong>Assigned by:</strong> {selectedTask.assignedBy?.username || "Unknown"}
                </p>
              </div>

              {selectedTask.assignedTo?.length > 0 && (
                <div className="progress-section">
                  <h4>Individual Progress</h4>
                  <div className="progress-charts">
                    {selectedTask.assignedTo.map((user, index) => {
                      const progressValue = user.progress || 0;
                      const colors = ["#00C49F", "#FFBB28", "#8884D8", "#FF8042", "#4CAF50"];
                      const chartData = [
                        { name: user.username, value: progressValue, fill: colors[index % colors.length] }
                      ];
                      return (
                        <div key={index} className="user-chart">
                          <RadialBarChart
                            width={140}
                            height={140}
                            innerRadius="60%"
                            outerRadius="90%"
                            data={chartData}
                            startAngle={180}
                            endAngle={0}
                          >
                            <RadialBar background dataKey="value" />
                          </RadialBarChart>
                          <p className="chart-label">{user.username}</p>
                          <p className="chart-percentage">{progressValue}%</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* Display Tasks */}
        <div className="task-grid">
          {tasks
            .filter(task =>
              (activeSection === "all" || task.status === activeSection) &&
              task.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((task, index) => (
              <div key={task.id}
                className="task-card"
                style={{ cursor: "pointer" }}>

                {editingTaskId === task._id ? (
                  <>
                    <input type="text" name="title" value={editedTask.title} onChange={handleEditChange} />
                    <textarea name="description" value={editedTask.description} onChange={handleEditChange} />
                    <input type="date" name="startDate" value={editedTask.startDate} onChange={handleEditChange} />
                    <input type="date" name="endDate" value={editedTask.endDate} onChange={handleEditChange} />
                    <div className="task-actions">
                      <FaSave className="save-icon" onClick={() => saveEdit(task._id)} />
                      <button className="cancel-btn" onClick={() => setEditingTaskId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Title: {task.title}</h3>
                    <p>Description: {task.description}</p>
                    <p className="task-date">Start: {task.startDate} | End: {task.endDate}</p>
                    <div className="task-actions">
                      <div className="task-actions-icon">
                        <FaEdit
                          className="edit-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(task);
                          }}
                        />
                        <FaTrash
                          className="delete-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task._id);
                          }}
                        />
                        <FaEye
                          className="view-icon"
                          onClick={() => handleTaskClick(task)}
                        />
                      </div>

                      {typeof task.progress === "number" && task.progress >= 0 ? (
                        <>
                          {/* Progress Container */}
                          <div className="progress-container">
                            {/* Percentage Display */}
                            {task.progress < 100 && (
                              <div className="percentage-display">
                                {task.progress}% completed
                              </div>
                            )}

                            {/* Range Slider */}
                            {task.progress < 100 && (
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={task.progress}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  if (newValue > task.progress) {
                                    updateTaskProgress(task._id, newValue);
                                  }
                                }}
                                className="progress-slider"
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>

                          {/* Green Tick Mark when Task is Completed */}
                          {task.progress === 100 && (
                            <FaCheck
                              className="complete-check"
                              style={{ color: "green", fontSize: "1.5em", marginLeft: "10px" }}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {/* Progress Container */}
                          <div className="progress-container">
                            {/* Range Slider when progress is undefined */}
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={0}
                              onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                updateTaskProgress(task._id, newValue);
                              }}
                              className="progress-slider"
                              onClick={(e) => e.stopPropagation()}
                            />

                            {/* Percentage Display */}
                            <div className="percentage-display">
                              0% completed
                            </div>
                          </div>
                        </>
                      )}


                    </div>
                  </>

                 
            )}
        </div>
            ))}
      </div>

    </div>
    </div >
  );
};

export default TaskManagement;