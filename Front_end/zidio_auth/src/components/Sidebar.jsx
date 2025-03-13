import React from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";

const Sidebar = ({ tasks, user = {} }) => {
  const { name = "User", email = "user@example.com" } = user;
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Radial Chart Data
  const data = [
    { name: "Completed", value: completedTasks, fill: "#34D399" }, // Green
    { name: "Pending", value: pendingTasks, fill: "#EF4444" }, // Red
  ];

  return (
    <div className="w-3/3 h-screen text-black p-6 flex flex-col">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <div>
          <p className="text-lg font-bold">Hello, {name}</p>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Task Overview</h2>

      {/* Radial Chart */}
      <div className="mx-auto mb-6">
        <RadialBarChart 
          width={200} 
          height={200} 
          innerRadius="40%" 
          outerRadius="80%" 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <RadialBar 
            minAngle={15} 
            background 
            clockWise 
            dataKey="value" 
          />
          <Legend 
            iconSize={10} 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
          />
          <Tooltip />
        </RadialBarChart>
      </div>

      {/* Task Summary */}
      <div className="mb-4 text-center">
        <p className="text-gray-400">Total: <span className="text-white font-semibold">{totalTasks}</span></p>
        <p className="text-green-400 font-semibold">Completed: {completedTasks}</p>
        <p className="text-red-400 font-semibold">Pending: {pendingTasks}</p>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center">No tasks added</p>
      ) : (
        <ul className="flex flex-col gap-2 overflow-y-auto">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`p-3 rounded flex items-center justify-between text-sm transition-all ${
                task.completed ? "bg-green-700 text-gray-300" : "bg-gray-800"
              }`}
            >
              <div className="flex-1 truncate">
                <span className={task.completed ? "line-through text-gray-400" : ""}>
                  {task.title}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  task.priority === "High"
                    ? "bg-red-500 text-white"
                    : task.priority === "Medium"
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-green-500 text-white"
                }`}
              >
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;