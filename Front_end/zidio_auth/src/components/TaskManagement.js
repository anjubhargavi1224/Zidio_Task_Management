import React, { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus, FaSave, FaCheck } from "react-icons/fa";
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [activeSection, setActiveSection] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress"
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: "", description: "", startDate: "", endDate: "", status: "" });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = () => {
    if (newTask.title && newTask.description && newTask.startDate && newTask.endDate) {
      const task = { id: Date.now(), ...newTask };
      setTasks([...tasks, task]);
      setNewTask({ title: "", description: "", startDate: "", endDate: "", status: "inProgress" });
      setShowForm(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditedTask({ title: task.title, description: task.description, startDate: task.startDate, endDate: task.endDate, status: task.status });
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

  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: "completed" } : task
      )
    );
  };

  return (
    <div className="task-container">
      <aside className="sidebar">
        <button className={activeSection === "all" ? "active" : ""} onClick={() => setActiveSection("all")}>All Tasks</button>
        <button className={activeSection === "inProgress" ? "active" : ""} onClick={() => setActiveSection("inProgress")}>In Progress</button>
        <button className={activeSection === "completed" ? "active" : ""} onClick={() => setActiveSection("completed")}>Completed</button>
      </aside>

      <div className="main-content">
        <hejader className="top-header">
        <h2>Task Management</h2>
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search bar" />
          </div>
          <div className="profile-section">
            <span className="notification-icon">🔔</span>
            <img src="profile.png" alt="Profile" className="profile-pic" />
          </div>
        </hejader>

        {showForm && (
          <div className="task-form-popup">
            <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleFormChange} />
            <textarea name="description" placeholder="Description" value={newTask.description} onChange={handleFormChange}></textarea>
            <input type="date" name="startDate" value={newTask.startDate} onChange={handleFormChange} />
            <input type="date" name="endDate" value={newTask.endDate} onChange={handleFormChange} />
            <div className="task-form-buttons">
              <button className="cancel-task-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={addTask}>Add Task</button>
            </div>
          </div>
        )}

        <div className="task-grid">
          {tasks.filter(task => activeSection === "all" || task.status === activeSection).map((task) => (
            <div key={task.id} className="task-card">
              {editingTaskId === task.id ? (
                <>
                  <input type="text" name="title" value={editedTask.title} onChange={handleEditChange} />
                  <textarea name="description" value={editedTask.description} onChange={handleEditChange} />
                  <input type="date" name="startDate" value={editedTask.startDate} onChange={handleEditChange} />
                  <input type="date" name="endDate" value={editedTask.endDate} onChange={handleEditChange} />
                  <div className="task-actions">
                    <FaSave className="save-icon" onClick={() => saveEdit(task.id)} />
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

        {activeSection === "all" && (
          <button className="add-task-btn" onClick={() => setShowForm(true)}>
            <FaPlus />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
