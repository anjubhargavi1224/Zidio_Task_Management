import React, { useState } from "react";
import { FaUsers, FaTasks, FaSignOutAlt, FaEdit, FaSave, FaTrash, FaCheck } from "react-icons/fa";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [tasks, setTasks] = useState([]); // State for task management
  const [users] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Alice Smith" },
    { id: 3, name: "Bob Johnson" },
  ]); // Sample Users

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
          <li className="logout">
            <FaSignOutAlt /> Logout
          </li>
        </ul>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
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

        {selectedTab === "tasks" && <AllTasks tasks={tasks} setTasks={setTasks} users={users} />}
      </div>
    </div>
  );
};

// ---------------------- AllTasks Component ----------------------
const AllTasks = ({ tasks, setTasks, users }) => {
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
        {tasks.map((task) => (
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
