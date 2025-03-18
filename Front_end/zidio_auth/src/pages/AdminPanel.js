import React, { useState } from "react";
import { FaUsers, FaTasks, FaSignOutAlt, FaEdit, FaSave, FaTrash, FaCheck } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [activeSection, setActiveSection] = useState("all"); // State for task filtering
  const [selectedUser , setSelectedUser ] = useState(""); // State for user filtering
  const [tasks, setTasks] = useState([]); // State for task management
  const [users] = useState([
    { id: 1, name: "John Doe", email: "johndoe003@gmail.com" },
    { id: 2, name: "Alice Smith", email: "alicesmith004@gmail.com" },
    { id: 3, name: "Bob Johnson", email: "bobjohnson003@gmail.com" },
    { id: 4, name: "Kim Bob", email: "bobkim005@gmail.com" },
  ]); // Sample Users

  // Chart data for task overview
  const data = [
    { name: "Completed", value: tasks.filter(task => task.status === "completed").length },
    { name: "Pending", value: tasks.filter(task => task.status !== "completed").length },
  ];

  // Colors for the pie chart
  const COLORS = ['#34D399', '#EF4444'];

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
          <PieChart width={345} height={170}>
            <Pie
              data={data}
              cx={150}
              cy={150}
              labelLine={false}
              label={entry => entry.name}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
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
          />
        )}
      </div>
    </div>
  );
};

// ---------------------- AllTasks Component ----------------------
const AllTasks = ({ tasks, setTasks, users, activeSection, setActiveSection, selectedUser , setSelectedUser  }) => {
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
  const addTask = () => {
    if (newTask.title && newTask.description && newTask.startDate && newTask.endDate && newTask.assignedTo) {
      const task = { id: Date.now(), ...newTask };
      setTasks([...tasks, task]);
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
        id="all-task">
          All Tasks
        </button>
        <button
          className={activeSection === "inProgress" ? "active" : ""}
          onClick={() => setActiveSection("inProgress")}
        id="in-progress">
          In Progress
        </button>
        <button
          className={activeSection === "completed" ? "active" : ""}
          onClick={() => setActiveSection("completed")}
        id="completed">
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
            <button onClick={addTask}>Add Task</button>
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