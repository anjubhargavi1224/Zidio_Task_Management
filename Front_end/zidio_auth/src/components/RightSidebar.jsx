import React from "react";
import { AiOutlineUnorderedList, AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";

const RightSidebar = ({ setFilter }) => {
  return (
    <div className="w-25 text-white p-4  h-screen shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Task Filters</h2>

      <div className="flex flex-col space-y-4 w-full">
        <button
          onClick={() => setFilter("all")}
          className="flex items-center space-x-2 w-full py-2 px-4 rounded bg-blue-500 hover:bg-blue-600"
        >
          <AiOutlineUnorderedList size={20} /> 
          <span></span>
        </button>
        <button
          onClick={() => setFilter("completed")}
          className="flex items-center space-x-2 w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600"
        >
          <AiOutlineCheckCircle size={20} /> 
          <span></span>
        </button>
        <button
          onClick={() => setFilter("pending")}
          className="flex items-center space-x-2 w-full py-2 px-4 rounded bg-red-500 hover:bg-red-600"
        >
          <AiOutlineClockCircle size={20} /> 
          <span></span>
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;