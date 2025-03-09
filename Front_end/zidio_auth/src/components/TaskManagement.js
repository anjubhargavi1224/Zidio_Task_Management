import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track which task is being edited
  const [editedTask, setEditedTask] = useState({ title: "", description: "", dateTime: "" });

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: "New Task",
      description: "Task Description",
      dateTime: new Date().toISOString().slice(0, 16), // Default to current date & time
      status: "all",
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ title: task.title, description: task.description, dateTime: task.dateTime });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const saveEdit = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...editedTask } : task
      )
    );
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter((task) =>
    activeSection === "all" ? true : task.status === activeSection
  );

  return (
    <div className="task-container">
      <aside className="sidebar">
        <h2>Task Management</h2>
        <button className={activeSection === "all" ? "active" : ""} onClick={() => setActiveSection("all")}>All Tasks</button>
        <button className={activeSection === "inProgress" ? "active" : ""} onClick={() => setActiveSection("inProgress")}>In Progress</button>
        <button className={activeSection === "completed" ? "active" : ""} onClick={() => setActiveSection("completed")}>Completed</button>
        <button className={activeSection === "todo" ? "active" : ""} onClick={() => setActiveSection("todo")}>To Do</button>
        <button className={activeSection === "team" ? "active" : ""} onClick={() => setActiveSection("team")}>Team</button>
      </aside>

      <div className="main-content">
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

        <div className="task-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              {editingTaskId === task.id ? (
                <>
                  <input type="text" name="title" value={editedTask.title} onChange={handleEditChange} />
                  <textarea name="description" value={editedTask.description} onChange={handleEditChange} />
                  <input type="datetime-local" name="dateTime" value={editedTask.dateTime} onChange={handleEditChange} />
                  <div className="task-actions">
                    <FaSave className="save-icon" onClick={() => saveEdit(task.id)} />
                    <FaTimes className="cancel-icon" onClick={cancelEdit} />
                  </div>
                </>
              ) : (
                <>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p className="task-date">{task.dateTime}</p>
                  <div className="task-actions">
                    <FaEdit className="edit-icon" onClick={() => startEditing(task)} />
                    <FaTrash className="delete-icon" onClick={() => deleteTask(task.id)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <button className="add-task-btn" onClick={addTask}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default TaskManagement;
