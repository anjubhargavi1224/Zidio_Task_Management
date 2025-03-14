import React, { useState } from "react";
import TaskSection from "./components/TaskSection";
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // Default: Show all tasks

  return (
    <div className="flex h-screen bg-gray-700">
      {/* Left Sidebar */}
      <Sidebar tasks={tasks} />

      {/* Main Task Section */}
      <div className="flex-1 p-6">
        <TaskSection tasks={tasks} setTasks={setTasks} filter={filter} />
      </div>

      {/* Right Sidebar for Task Filtering */}
      <RightSidebar setFilter={setFilter} />
    </div>
  );
};

export default App;
