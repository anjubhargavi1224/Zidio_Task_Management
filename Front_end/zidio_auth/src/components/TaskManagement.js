import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TaskManagement.css";

const TaskManagement = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    startDate: "",
    endDate: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Submit task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.description.trim() || !task.assignedTo.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setTasks([...tasks, { ...task, id: Date.now() }]);
    setTask({ title: "", description: "", assignedTo: "", startDate: "", endDate: "" });
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="profile">
          <FaUserCircle className="icon" />
          <div>
            <h3>Guest</h3>
            <p>guest@example.com</p>
          </div>
        </div>
        <button className="logout-btn" onClick={() => navigate("/")}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      {/* Task Form */}
      <section className="task-form">
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={task.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Enter task description"
            value={task.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="assignedTo"
            placeholder="Assign to (e.g. John Doe)"
            value={task.assignedTo}
            onChange={handleChange}
            required
          />
          <div className="date-group">
            <input
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={task.startDate}
              onChange={handleChange}
            />
            <input
              type="date"
              name="endDate"
              placeholder="End Date"
              value={task.endDate}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="submit-btn">Add Task</button>
        </form>
      </section>

      {/* Task List */}
      {tasks.length > 0 && (
        <section className="task-list">
          <h2>Task List</h2>
          {tasks.map((t) => (
            <div key={t.id} className="task-item">
              <h3>{t.title}</h3>
              <p>{t.description}</p>
              <p><strong>Assigned To:</strong> {t.assignedTo}</p>
              <p><strong>Start:</strong> {t.startDate || "N/A"} | <strong>End:</strong> {t.endDate || "N/A"}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TaskManagement;
