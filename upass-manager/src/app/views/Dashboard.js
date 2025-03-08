import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Enter PID"
            aria-label="Enter PID"
          />
          <button className="flex-shrink-0 bg-transparent border-none text-gray-700 py-1 px-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <button
          className="mt-4 bg-[#861F41] text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Dashboard;