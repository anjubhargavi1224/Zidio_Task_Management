import React, { useState } from "react";
import { AiOutlineUnorderedList, AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { FaSearch } from "react-icons/fa";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Profile state
  const [profile, setProfile] = useState({
    username: "JohnDoe",
    email: "johndoe@example.com",
  });

  const addTask = () => {
    if (newTask.title.trim() === "") return;
    
    // Update or Add Task
    setTasks(prevTasks => 
      editTaskId 
        ? prevTasks.map(task => (task.id === editTaskId ? { ...newTask, id: editTaskId } : task)) 
        : [...prevTasks, { ...newTask, id: Date.now(), completed: false }]
    );
    
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setNewTask({ title: "", description: "", priority: "Medium", deadline: "" });
    setShowAddTask(false);
    setEditTaskId(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEdit = (task) => {
    setNewTask(task);
    setEditTaskId(task.id);
    setShowAddTask(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Chart data for task overview
  const data = [
    { name: "Completed", value: tasks.filter(task => task.completed).length, fill: "#34D399" },
    { name: "Pending", value: tasks.filter(task => !task.completed).length, fill: "#EF4444" },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-700">

<header className="w-[100vw] bg-gray-600 p-4 flex justify-between items-center shadow-md fixed top-0 z-50">
  <div className="flex items-center bg-gray-200 p-2 ml-6 rounded-full">
    <FaSearch className="text-gray-500" />
    <input type="text" placeholder="Search bar" className="border-none outline-none bg-transparent ml-2" />
  </div>
  <div className="flex items-center">
    <span className="text-lg mr-6">🔔</span>
    <img src="profile.png" alt="Profile" className="w-10 h-10 rounded-full object-cover mr-9" />
  </div>
</header>

      {/* Sidebar with Profile */}
      <div className="w-50 h-auto text-black p-6 flex flex-col mt-20">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Hello, Welcome!</h2>
          <p className="text-gray-600">{profile.username}</p>
          <p className="text-gray-600">{profile.email}</p>
        </div>
        
        <h2 className="text-xl font-bold mb-4">Task Overview</h2>
        <div className="mx-auto mb-6">
          <RadialBarChart width={200} height={200} innerRadius="40%" outerRadius="80%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar minAngle={15} background clockWise dataKey="value" />
            <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
            <Tooltip />
          </RadialBarChart>
        </div>
      </div>

      {/* Main Task Management Area */}
      <div className="flex-1 p-6 mt-20 rounded text-black h-auto">
        <button onClick={() => setShowAddTask(!showAddTask)} className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          {showAddTask ? "Hide Add Task" : "Add Task"}
        </button>

        {showAddTask && (
          <div className="mb-6 bg-gray-100 p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-2">{editTaskId ? "Edit Task" : "Add New Task"}</h2>
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
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-2 border rounded mb-2 resize-none min-h-[80px]"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <input
              type="datetime-local"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={addTask}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {editTaskId ? "Update Task" : "Add Task"}
            </button>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-2 text-white">
          {filter === "completed" ? "Completed Tasks" : filter === "pending" ? "Pending Tasks" : "All Tasks"}
        </h2>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks available.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 w-100 border-gray-500 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${task.completed ? "bg-green-200 text-gray-600" : "bg-gray-100"}`}
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="flex-1">
                    <p className="text-lg font-semibold break-words">{task.title}</p>
                    <p className="text-sm text-gray-600 break-words whitespace-pre-line mt-1">{task.description}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-2 ${task.priority === "High" ? "bg-red-500 text-white" : task.priority === "Medium" ? "bg-yellow-500 text-gray-900" : "bg-green-500 text-white"}`}>
                      {task.priority} Priority
                    </span>
                    {task.deadline && (
                      <p className="text-xs text-gray-500 mt-1">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <button onClick={() => toggleComplete(task.id)} className={`px-2 py-1 text-xs rounded ${task.completed ? "bg-gray-400" : "bg-green-500 text-white"}`}>
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button onClick={() => handleEdit(task)} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Edit</button>
                    <button onClick={() => deleteTask(task.id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Task Filters Section */}
      <div className="w-30 h-auto text-white p-4 mt-20 shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Task Filters</h2>
        <div className="flex flex-col space-y-4 w-full">
          <button onClick={() => setFilter("all")} className="flex items-center space-x-2 w-full py-2 px-4 rounded bg-blue-500 hover:bg-blue-600">
            <AiOutlineUnorderedList size={20} />
          </button>
          <button onClick={() => setFilter("completed")} className="flex items-center space-x-2 w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600">
            <AiOutlineCheckCircle size={20} />
          </button>
          <button onClick={() => setFilter("pending")} className="flex items-center space-x-2 w-full py-2 px-4 rounded bg-red-500 hover:bg-red-600">
            <AiOutlineClockCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;