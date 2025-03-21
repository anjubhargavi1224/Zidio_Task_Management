import React, { useState, useEffect } from "react";
import { FaUsers, FaTasks, FaSignOutAlt, FaEdit, FaSave, FaTrash, FaCheck, FaPlus } from "react-icons/fa";
import { BarChart, Bar, XAxis, Tooltip, Legend } from "recharts";
import CreateUser  from "../components/CreateUser "; // Import the CreateUser  component
import "./AdminPanel.css";

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("all"); // State for task filtering
  const [selectedUser , setSelectedUser ] = useState(""); // State for user filtering
  const [tasks, setTasks] = useState([]); // State for task management
  const [users, setUsers] = useState([]); // State for users
  const [chartData, setChartData] = useState([]);
  const [showCreateUser , setShowCreateUser ] = useState(false); // State to control Create User form visibility

  // Load users and tasks from localStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setUsers(storedUsers);
    setTasks(storedTasks);
  }, []);

  // Effect to update chart data whenever tasks, activeSection, or selectedUser  changes
  useEffect(() => {
    const filteredTasks = tasks.filter(task =>
      (activeSection === "all" || task.status === activeSection) &&
      (selectedUser  === "" || task.assignedTo === selectedUser )
    );

    const completedCount = filteredTasks.filter(task => task.status === "completed").length;
    const pendingCount = filteredTasks.filter(task => task.status !== "completed").length;

    setChartData([
      {
        name: "Tasks",
        completed: completedCount,
        pending: pendingCount,
      },
    ]);
  }, [tasks, activeSection, selectedUser ]);

  // Custom Legend Component
  const CustomLegend = () => (
    <div className="custom-legend">
      <div style={{ color: "#34D399" }}>Completed: {chartData[0]?.completed}</div>
      <div style={{ color: "#EF4444" }}>Pending: {chartData[0]?.pending}</div>
    </div>
  );

  // Function to handle user creation
  const handleCreateUser  = (newUser ) => {
    const newUserWithId = { id: Date.now(), ...newUser  }; // Assign a unique ID
    const updatedUsers = [...users, newUserWithId];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers)); // Save to localStorage
  };

  // Function to add a new task
  const addTask = (newTask) => {
    const taskWithId = { id: Date.now(), ...newTask };
    const updatedTasks = [...tasks, taskWithId];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save to localStorage

    // Notify the assigned user
    const assignedUser  = users.find(user => user.name === newTask.assignedTo);
    if (assignedUser ) {
      const userNotifications = JSON.parse(localStorage.getItem(`notifications_${assignedUser .id}`)) || [];
      userNotifications.push(`A new task "${newTask.title}" has been assigned to you.`);
      localStorage.setItem(`notifications_${assignedUser .id}`, JSON.stringify(userNotifications));
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
        </ul>

        <div className="chart-container">
          <BarChart width={250} height={170} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" hide={true} />
            <Tooltip />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="completed" fill="#34D399" />
            <Bar dataKey="pending" fill="#EF4444" />
          </BarChart>
        </div>

        <div className="logout">
          <FaSignOutAlt /><span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <h1>Dashboard</h1>
        </header>

        {/* Conditional Rendering Based on Selected Tab */}
        <section className="admin-stats">
          <div className="stat-box">Total Users: {users.length}</div>
          <div className="stat-box">Total Tasks: {tasks.length}</div>
        </section>

        {selectedTab === "users" && (
          <section className="admin-users">
            <h2>User Management</h2>
            <button onClick={() => setShowCreateUser (true)}><FaPlus /> Create User</button>
            {showCreateUser  && (
              <CreateUser  onCreate={handleCreateUser } onClose={() => setShowCreateUser (false)} />
            )}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
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
            selectedUser ={selectedUser }
            setSelectedUser ={setSelectedUser }
            addTask={addTask} // Pass addTask function to AllTasks
          />
        )}
      </div>
    </div>
  );
};

// ---------------------- AllTasks Component ----------------------
const AllTasks = ({ tasks, setTasks, users, activeSection, setActiveSection, selectedUser , setSelectedUser , addTask }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: "",
    status: "inProgress",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assignedTo: "",
    status: "",
  });

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Add new task
  const addNewTask = () => {
    if (newTask.title && newTask.description && newTask.startDate && newTask.endDate && newTask.assignedTo) {
      addTask(newTask); // Use the addTask function passed from AdminPanel
      setNewTask({ title: "", description: "", startDate: "", endDate: "", assignedTo: "", status: "inProgress" });
      setShowForm(false);
    }
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
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
  const saveEdit = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...editedTask } : task)));
    setEditingTaskId(null);
  };

  // Mark task as complete
  const completeTask = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)));
  };

  return (
    <div className="MAIN_CONTENT">
      <p>Here you can manage tasks...</p>

      {/* Task Filters */}
      <div className="task-filters-admin">
        {/* User Selection Dropdown */}
        <label htmlFor="userFilter">Filter by User:</label>
        <select
          id="userFilter"
          value={selectedUser }
          onChange={(e) => setSelectedUser (e.target.value)}
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
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
          className={activeSection === "inProgress" ? "active" : ""}
          onClick={() => setActiveSection("inProgress")}
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

      <button className="ADD_TASK_BTN" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div className="TASK_FORM_POPUP">
          <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleFormChange} />
          <textarea name="description" placeholder="Description" value={newTask.description} onChange={handleFormChange}></textarea>
          <input type="date" name="startDate" value={newTask.startDate} onChange={handleFormChange} />
          <input type="date" name="endDate" value={newTask.endDate} onChange={handleFormChange} />

          {/* Assign To Dropdown */}
          <label htmlFor="assignedTo">Assign To:</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={newTask.assignedTo}
            onChange={handleFormChange}
            required
          >
            <option value="" disabled>Select a user</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))
            ) : (
              <option disabled>No users available</option>
            )}
          </select>

          <div className="TASK_FORM_BUTTONS">
            <button className="CANCEL_TASK_BTN" onClick={() => setShowForm(false)}>Cancel</button>
            <button onClick={addNewTask}>Add Task</button>
          </div>
        </div>
      )}

      <div className="TASK_GRID">
        {tasks
          .filter(task =>
            (activeSection === "all" || task.status === activeSection) &&
            (selectedUser  === "" || task.assignedTo === selectedUser ) // Filter tasks based on active section and selected user
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
                  <p>Assigned To: {task.assignedTo}</p>
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
  );
};

export default AdminPanel;