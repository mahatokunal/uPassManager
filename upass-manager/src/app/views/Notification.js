"use client";

import React, { useState } from "react";

const Notification = () => {
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

  const handleSendNotification = () => {
    if (!message || !filter) {
      alert("Please enter a message and select a filter.");
      return;
    }
    alert(`Notification sent to ${filter} users: ${message}`);
    // Add your logic to send the notification here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Send Notification</h1>
      
      {/* Text Area for Message */}
      <textarea
        className="w-full max-w-lg p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="5"
        placeholder="Enter your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      {/* Filter Options */}
      <div className="mt-4 w-full max-w-lg">
        <label className="block text-gray-700 font-bold mb-2">Filter:</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="" disabled>Select a filter</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Disclaimer">Disclaimer</option>
        </select>
      </div>

      {/* Send Notification Button */}
      <button
        className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600"
        onClick={handleSendNotification}
      >
        Send Notification
      </button>
    </div>
  );
};

export default Notification;