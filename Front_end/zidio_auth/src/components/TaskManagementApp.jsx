import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TaskSection from "./TaskSection";

const TaskManagementApp = () => {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="flex h-screen gap-4 bg-gray-100 p-4">
      <Sidebar tasks={tasks} />
      <TaskSection tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default TaskManagementApp;