import React, { useState, useEffect /*useContext*/, useContext } from "react";
import {
  FaUsers,
  FaTasks,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTrash,
  FaVideo,
  FaEye,
  /*FaPlus*/
} from "react-icons/fa";
import { RadialBarChart, RadialBar } from "recharts";

import { BarChart, Bar, XAxis, Tooltip, Legend } from "recharts";
import CreateUser from "./CreateUser"; // Import the CreateUser  component
import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import {
  updateTaskDetails,
  getTasks,
  createTask,
  createSelfTask,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";

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




const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("all"); // State for task filtering
  const [selectedUser, setSelectedUser] = useState(""); // State for user filtering
  const [tasks, setTasks] = useState([]); // State for task management
  const [users, setUsers] = useState([]); // State for users
  const [chartData, setChartData] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false); // State to control Create User form visibility
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: "",
  });
  const token = localStorage.getItem("token");
  // console.log(token)
  const fetchTasks = async () => {
    try {
      const response = await getTasks(token);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  // Check if the user is logged in and has admin role
  // If not, redirect to login page
  useEffect(() => {
    if (!token) {
      alert("You are not authorized to access this page.");
      window.location.replace("/"); // Redirect to login page if not authenticated
    } else if (user && user.role !== "admin") {
      alert("You are not authorized to access this page.");
      window.location.replace("/"); // Redirect to login page if not admin
    }
  }, [user]); // Run on user change

  // Check if the user is an admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      alert("You are not authorized to access this page.");
      window.location.replace("/"); // Redirect to login page if not admin
    }
  }, [user]); // Run on user change

  // console.log(user)

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/users"); // Replace with your actual API endpoint
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Update chart data
  useEffect(() => {
    const filteredTasks = tasks.filter(
      (task) =>
        (activeSection === "all" || task.status === activeSection) &&
        (selectedUser === "" ||
          (Array.isArray(task.assignedTo)
            ? task.assignedTo.some((user) =>
              typeof user === "string" ? user === selectedUser : user.username === selectedUser
            )
            : task.assignedTo === selectedUser))
    );

    const completedCount = filteredTasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pendingCount = filteredTasks.filter(
      (task) => task.status !== "completed"
    ).length;

    setChartData([
      {
        name: "Tasks",
        completed: completedCount,
        pending: pendingCount,
      },
    ]);
  }, [tasks, activeSection, selectedUser]);

  // Custom Legend Component
  const CustomLegend = () => (
    <div className="custom-legend">
      <div style={{ color: "#34D399" }}>
        Completed: {chartData[0]?.completed}
      </div>
      <div style={{ color: "#EF4444" }}>Pending: {chartData[0]?.pending}</div>
    </div>
  );

  // Function to add a new task
  const addTask = (newTask) => {
    const taskWithId = { id: Date.now(), ...newTask };
    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save to localStorage

    // Notify the assigned user
    const assignedUser = users.find((user) => user.name === newTask.assignedTo);
    if (assignedUser) {
      const userNotifications =
        JSON.parse(localStorage.getItem(`notifications_${assignedUser.id}`)) ||
        [];
      userNotifications.push(
        `A new task "${newTask.title}" has been assigned to you.`
      );
      localStorage.setItem(
        `notifications_${assignedUser.id}`,
        JSON.stringify(userNotifications)
      );
    }
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

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token"); // Ensure user is authenticated
    if (!token) {
      alert("Unauthorized: Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/auth/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("User deleted successfully!");
        // Refresh the user list after deletion
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred. Please try again.");
    }
  };


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





  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setSelectedTab("users")}>
            <FaUsers /> Manage Users
          </li>
          <li onClick={() => setSelectedTab("tasks")}>
            <FaTasks /> Manage Tasks
          </li>
          <li onClick={() => navigate("/meet")}>
            <FaVideo /> Start your Meeting
          </li>
        </ul>

        <div className="chart-container">
          <BarChart
            width={250}
            height={170}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" hide={true} />
            <Tooltip />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="completed" fill="#34D399" />
            <Bar dataKey="pending" fill="#EF4444" />
          </BarChart>
        </div>

        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1>Dashboard</h1>
          <button
            className="calendar-btn"
            onClick={() => setShowCalendar(true)}
            title="Open Calendar"
          >
            <FaCalendarAlt size={22} />
          </button>
        </header>

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



        {/* Conditional Rendering Based on Selected Tab */}
        <section className="admin-stats">
          <div className="stat-box">Total Users: {users.length}</div>
          <div className="stat-box">Total Tasks: {tasks.length}</div>
        </section>

        {selectedTab === "users" && (
          <section className="admin-users">
            <h2>User Management</h2>

            {showCreateUser && (
              <CreateUser onClose={() => setShowCreateUser(false)} />
            )}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {selectedTab === "tasks" && (
          <AllTasks
            tasks={tasks}
            setTasks={setTasks}
            users={users}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            addTask={addTask} // Pass addTask function to AllTasks
          />
        )}
      </div>
    </div>
  );
};

// ---------------------- AllTasks Component ----------------------
const AllTasks = ({
  tasks,
  setTasks,
  users,
  activeSection,
  setActiveSection,
  selectedUser,
  setSelectedUser,
  addTask,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: [],
    status: "inProgress",
  });
  const [editingTaskId, setEditingTaskId] = useState(0);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: [],
    status: "",
  });
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: [],
  });
  const token = localStorage.getItem("token");

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setTaskData((prev) => ({
        ...prev,
        assignedTo: users.map((user) => user._id), // Use user._id instead of username
      }));
    } else {
      setTaskData((prev) => ({ ...prev, assignedTo: [] }));
    }
  };

  // Handle individual user selection
  const handleUserSelection = (e) => {
    const { value, checked } = e.target;
    setTaskData((prev) => ({
      ...prev,
      assignedTo: checked
        ? [...prev.assignedTo, value]
        : prev.assignedTo.filter((id) => id !== value),
    }));
  };

  ///////////////////////////////////////////////////////////////////////////////////

  const fetchTasks = async () => {
    try {
      const response = await getTasks(token);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  console.log(tasks);
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };
  console.log(taskData);
  console.log(users);

  ////////////////////////////////////////////
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
        console.log(`Task "${completedTask.title}" has been completed!`);
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

  // const handleFormChange = (e) => {
  //   const { name, value } = e.target;
  //   const today = new Date().toISOString().split("T")[0];

  //   setNewTask((prevTask) => {
  //     if (name === "startDate") {
  //       if (value < today) {
  //         alert("Start Date cannot be in the past!");
  //         return prevTask;
  //       }
  //       // Reset end date if it is before new start date
  //       if (prevTask.endDate && value > prevTask.endDate) {
  //         return { ...prevTask, startDate: value, endDate: "" };
  //       }
  //     }

  //     if (name === "endDate") {
  //       if (!prevTask.startDate) {
  //         alert("Please select a Start Date first!");
  //         return prevTask;
  //       }
  //       if (value < prevTask.startDate) {
  //         alert("End Date cannot be before the Start Date!");
  //         return prevTask;
  //       }
  //     }

  //     return { ...prevTask, [name]: value };
  //   });
  // };

  // Add new task
  const addNewTask = () => {
    if (
      newTask.title &&
      newTask.description &&
      newTask.startDate &&
      newTask.endDate &&
      newTask.assignedTo
    ) {
      addTask(newTask); // Use the addTask function passed from AdminPanel
      setNewTask({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        assignedTo: "",
        status: "inProgress",
      });
      setShowForm(false);
    }
  };

  // Delete a task
  // const deleteTask = (taskId) => {
  //   setTasks(tasks.filter((task) => task.id !== taskId));
  // };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      assignedTo: task.assignedTo,
      status: task.status,
    });
  };

  // Handle task edit changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  // Save edited task
  const saveEdit = async (taskId) => {
    try {
      await updateTaskDetails(taskId, editedTask, token); // Send update to backend
      fetchTasks(); // Refresh tasks from backend
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error saving task", error);
    }
  };
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
    <div className="MAIN_CONTENT">
      <p>Here you can manage tasks...</p>

      {/* Task Filters */}
      <div className="task-filters-admin">
        <label htmlFor="userFilter">Filter by User:</label>

        <select
          id="userFilter"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">All Users</option>
          {users.map((user, index) => (
            <option key={user.id || index} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>

        <button
          className={activeSection === "all" ? "active" : ""}
          onClick={() => setActiveSection("all")}
          id="all-task"
        >
          All Tasks
        </button>
        <button
          className={activeSection === "in-progress" ? "active" : ""}
          onClick={() => setActiveSection("in-progress")}
          id="in-progress"
        >
          In Progress
        </button>
        <button
          className={activeSection === "completed" ? "active" : ""}
          onClick={() => setActiveSection("completed")}
          id="completed"
        >
          Completed
        </button>
      </div>

      <button className="ADD_TASK_BTN" onClick={() => setShowForm(true)}>
        +
      </button>

      {showForm && (
        <div className="TASK_FORM_POPUP">
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
          <input type="date" name="startDate" onChange={handleChange} />
          <input type="date" name="endDate" onChange={handleChange} />

          {/* Assign To Multi-Select Checkboxes */}
          <label>Assign To:</label>
          <div className="assign-to-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={taskData.assignedTo.length === users.length}
              />
              Select All
            </label>

            <div className="assign-to-checkboxes">
              {users.length > 0 ? (
                users.map((user) => (
                  <label key={user._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="assignedTo"
                      value={user._id} // Send _id instead of username
                      checked={taskData.assignedTo.includes(user._id)}
                      onChange={handleUserSelection}
                    />
                    {user.username}
                  </label>
                ))
              ) : (
                <p>No users available</p>
              )}
            </div>
          </div>

          <div className="TASK_FORM_BUTTONS">
            <button
              className="CANCEL_TASK_BTN"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button onClick={handleCreateTask}>Add Task</button>
          </div>
        </div>
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


      <div className="TASK_GRID">
        {tasks
          .filter(
            (task) =>
              (activeSection === "all" || task.status === activeSection) &&
              (selectedUser === "" ||
                (Array.isArray(task.assignedTo)
                  ? task.assignedTo.some((user) =>
                    typeof user === "string" ? user === selectedUser : user.username === selectedUser
                  )
                  : task.assignedTo === selectedUser))
          )
          .map((task, index) => (
            <div key={task.id} className="TASK_CARD">
              {editingTaskId === task._id ? (
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
                  <div className="TASK_ACTIONS">
                    <FaSave className="SAVE_ICON" onClick={() => saveEdit(task._id)} />
                    <button
                      className="CANCEL_EDIT_BTN"
                      onClick={() => setEditingTaskId(null)}
                    >
                      Cancel Edit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>Title: {task.title}</h3>
                  <p>Description: {task.description}</p>
                  <p>
                    Assigned To:{" "}
                    {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                      ? task.assignedTo
                        .map((user) =>
                          typeof user === "string" ? user : user.username
                        )
                        .join(", ")
                      : "Not Assigned"}
                  </p>

                  <p className="TASK_DATE">
                    Start: {task.startDate} | End: {task.endDate}
                  </p>
                  <div className="TASK_ACTIONS">
                    <FaEdit className="EDIT_ICON" onClick={() => startEditing(task)} />
                    <FaTrash
                      className="DELETE_ICON"
                      onClick={() => handleDeleteTask(task._id)}
                    />
                    <FaEye
                      className="view-icon"
                      onClick={() => handleTaskClick(task)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}

      </div>
    </div>
  );
};

export default AdminPanel;
