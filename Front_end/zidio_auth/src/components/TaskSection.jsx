import React, { useState } from "react";

const TaskSection = ({ tasks, setTasks, filter }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = () => {
    if (newTask.title.trim() === "") return;
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setNewTask({ title: "", description: "", priority: "Medium" });
    setShowAddTask(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // *Apply the selected filter from RightSidebar*
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // Show all tasks
  });

  return (
    <div className="p-6 rounded text-black h-screen">
      <button
        onClick={() => setShowAddTask(!showAddTask)}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {showAddTask ? "Hide Add Task" : "Add Task"}
      </button>

      {showAddTask && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">Add New Task</h2>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 resize-none min-h-[80px]"
          />
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button
            onClick={addTask}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-2 text-white">
        {filter === "completed"
          ? "Completed Tasks"
          : filter === "pending"
          ? "Pending Tasks"
          : "All Tasks"}
      </h2>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-400 text-center">No tasks available.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`p-4 border-gray-500 bg-white rounded shadow-md transition-all ${
                task.completed ? "bg-green-700 text-gray-300" : "bg-gray-800"
              } flex flex-col justify-between min-h-[120px]`}
            >
              <div className="flex-1">
                <p className="text-lg font-semibold break-words">{task.title}</p>
                <p className="text-sm text-gray-400 break-words whitespace-pre-line mt-1">
                  {task.description}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-2 ${
                    task.priority === "High"
                      ? "bg-red-500 text-white"
                      : task.priority === "Medium"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`px-3 py-1 text-xs rounded ${
                    task.completed ? "bg-gray-400" : "bg-green-500 text-white"
                  }`}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskSection;