"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [pid, setPid] = useState('');

  const cardData = [
    {
      title: "Add Distributor",
      description: "The admin can add distributors who can then give access to specific options.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      bgColor: "bg-[#861F41]",
    },
    {
      title: "Upload File",
      description: "This option is only accessible to Distributors who can upload files.",
      icon: (
        <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-6 w-6 text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M12 19V6m0 0l-5 5m5-5l5 5"
  />
</svg>
      ),
      bgColor: "bg-[#1F618D]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">

        <div className="flex flex-col items-center w-full max-w-lg">
          <div className="flex items-center border border-gray-300 rounded-full py-2 px-4 w-full">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Enter PID"
              aria-label="Enter PID"
              value={pid}
              onChange={(e) => setPid(e.target.value)}
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
          <button className="mt-4 bg-[#861F41] text-white font-bold py-2 px-4 rounded">
            Search
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-white shadow-md border border-gray-100"
              style={{ borderRadius: '50px' }}
            >
              <div className={`${card.bgColor} rounded-full p-3 mr-4`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-md font-bold text-[#861F41] mb-1">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-xs">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;