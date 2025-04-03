"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Notification = () => {
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState([]);

  const handleSendNotification = () => {
    if (!message || filters.length === 0) {
      alert("Please enter a message and select at least one filter.");
      return;
    }
    alert(`Notification sent to ${filters.join(", ")} users: ${message}`);
    // Add your logic to send the notification here
  };

  const handleCheckboxChange = (filter) => {
    setFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-6">
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
          <label className="block text-gray-700 font-bold mb-2">Filters:</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value="Full-time"
                checked={filters.includes("Full-time")}
                onChange={() => handleCheckboxChange("Full-time")}
              />
              Full-time
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value="Part-time"
                checked={filters.includes("Part-time")}
                onChange={() => handleCheckboxChange("Part-time")}
              />
              Part-time
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value="Disclaimer"
                checked={filters.includes("Disclaimer")}
                onChange={() => handleCheckboxChange("Disclaimer")}
              />
              Disclaimer
            </label>
          </div>
        </div>

        {/* Send Notification Button */}
        <button
          className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600"
          onClick={handleSendNotification}
        >
          Send Notification
        </button>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Notification;