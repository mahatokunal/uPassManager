"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Notification = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of rows per page
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getUpassData");
        const result = await response.json();
        setData(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">U-Pass Data</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto w-full max-w-6xl">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-black">U-Pass ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Active Card</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Replaced Card</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Metro Acct</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Distribution Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Picked Up By</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">ID Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">First Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Last Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Disclaimer Signed</th>
                    <th className="border border-gray-300 px-4 py-2 text-black">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.U_Pass_ID} className="text-center">
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.U_Pass_ID}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Active_U_Pass_Card}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Replaced_U_Pass_Card}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Metro_Acct}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{new Date(item.Distribution_Date).toLocaleDateString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Picked_Up_By}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.ID_Number}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.First_Name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Last_Name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Email}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black">{item.Disclaimer_Signed ? "Yes" : "No"}</td>
                      <td className="border border-gray-300 px-4 py-2 text-black truncate max-w-xs"
                      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.Notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-l-lg hover:bg-gray-400 text-gray-700"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-white border-t border-b border-gray-300 text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-300 rounded-r-lg hover:bg-gray-400 text-gray-700"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Notification;