"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Notifications = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalRecords: 0
  });
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [filters, setFilters] = useState({
    ID_Number: '',
    First_Name: '',
    Last_Name: '',
    Email: '',
    Active_U_Pass_Card: '',
    Disclaimer_Signed: '',
    Metro_Acct: '',
    Distribution_Date: '',
    Picked_Up_By: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    ID_Number: true,
    First_Name: true,
    Last_Name: true,
    Email: true,
    Active_U_Pass_Card: true,
    Replaced_U_Pass_Card: true,
    Disclaimer_Signed: true,
    Metro_Acct: true,
    Distribution_Date: true,
    Picked_Up_By: true,
    Notes: true,
    U_Pass_ID: true
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Column definitions with display names
  const columnDefs = [
    { key: 'ID_Number', label: 'PID' },
    { key: 'First_Name', label: 'First Name' },
    { key: 'Last_Name', label: 'Last Name' },
    { key: 'Email', label: 'Email' },
    { key: 'Active_U_Pass_Card', label: 'Active U-Pass' },
    { key: 'Replaced_U_Pass_Card', label: 'Replaced U-Pass' },
    { key: 'Disclaimer_Signed', label: 'Disclaimer' },
    { key: 'Metro_Acct', label: 'Metro Account' },
    { key: 'Distribution_Date', label: 'Distribution Date' },
    { key: 'Picked_Up_By', label: 'Picked Up By' },
    { key: 'Notes', label: 'Notes' },
    { key: 'U_Pass_ID', label: 'U-Pass ID' }
  ];

  // Fetch records on component mount and when pagination or filters change
  useEffect(() => {
    fetchRecords();
  }, [pagination.page, pagination.limit, filters]);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string with pagination and filters
      let queryString = `page=${pagination.page}&limit=${pagination.limit}`;
      
      // Add filters to query string
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '') {
          queryString += `&${key}=${encodeURIComponent(value)}`;
        }
      });
      
      const response = await fetch(`/api/get-all-records?${queryString}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch records');
      }
      
      setRecords(data.records);
      setPagination(prev => ({
        ...prev,
        ...data.pagination
      }));
    } catch (err) {
      console.error('Error fetching records:', err);
      setError(err.message || 'An error occurred while fetching records');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  const handleSelectRecord = (id) => {
    setSelectedRecords(prev => {
      if (prev.includes(id)) {
        return prev.filter(recordId => recordId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map(record => record.ID_Number));
    }
  };

  const handleSendNotification = async () => {
    if (selectedRecords.length === 0) {
      setError('Please select at least one recipient');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    setSendingNotification(true);
    setError(null);
    
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: selectedRecords,
          message: message
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send notification');
      }
      
      setNotificationSuccess(true);
      setMessage('');
      setSelectedRecords([]);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setNotificationSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending notification:', err);
      setError(err.message || 'An error occurred while sending notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setPagination(prev => ({
      ...prev,
      page: 1 // Reset to first page when applying filters
    }));
  };

  const resetFilters = () => {
    setFilters({
      ID_Number: '',
      First_Name: '',
      Last_Name: '',
      Email: '',
      Active_U_Pass_Card: '',
      Disclaimer_Signed: '',
      Metro_Acct: '',
      Distribution_Date: '',
      Picked_Up_By: ''
    });
  };

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#861F41]">Send Notifications</h1>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {notificationSuccess && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
            Notification sent successfully!
          </div>
        )}
        
        {/* Filter Panel */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-[#861F41] hover:text-[#6e1935] transition"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center text-[#861F41] hover:text-[#6e1935] transition"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {showColumnSelector ? 'Hide Columns' : 'Show/Hide Columns'}
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PID</label>
                  <input
                    type="text"
                    value={filters.ID_Number}
                    onChange={(e) => handleFilterChange('ID_Number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                    placeholder="Filter by PID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={filters.First_Name}
                    onChange={(e) => handleFilterChange('First_Name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                    placeholder="Filter by first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={filters.Last_Name}
                    onChange={(e) => handleFilterChange('Last_Name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                    placeholder="Filter by last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    value={filters.Email}
                    onChange={(e) => handleFilterChange('Email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                    placeholder="Filter by email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">U-Pass ID</label>
                  <input
                    type="text"
                    value={filters.Active_U_Pass_Card}
                    onChange={(e) => handleFilterChange('Active_U_Pass_Card', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                    placeholder="Filter by U-Pass ID"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disclaimer Signed</label>
                  <select
                    value={filters.Disclaimer_Signed}
                    onChange={(e) => handleFilterChange('Disclaimer_Signed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                  >
                    <option value="">All</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Reset Filters
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-[#861F41] text-white rounded hover:bg-[#6e1935] transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {showColumnSelector && (
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Show/Hide Columns</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {columnDefs.map(column => (
                  <div key={column.key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`column-${column.key}`}
                      checked={visibleColumns[column.key]}
                      onChange={() => toggleColumnVisibility(column.key)}
                      className="h-4 w-4 text-[#861F41] focus:ring-[#861F41] border-gray-300 rounded"
                    />
                    <label htmlFor={`column-${column.key}`} className="ml-2 text-sm text-gray-700">
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#861F41] focus:ring-[#861F41] border-gray-300 rounded"
                        checked={selectedRecords.length === records.length && records.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span className="ml-2">Select</span>
                    </div>
                  </th>
                  {columnDefs.map(column => (
                    visibleColumns[column.key] && (
                      <th 
                        key={column.key}
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#861F41]"></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Loading records...</p>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.ID_Number} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-[#861F41] focus:ring-[#861F41] border-gray-300 rounded"
                          checked={selectedRecords.includes(record.ID_Number)}
                          onChange={() => handleSelectRecord(record.ID_Number)}
                        />
                      </td>
                      {visibleColumns.ID_Number && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.ID_Number}
                        </td>
                      )}
                      {visibleColumns.First_Name && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.First_Name}
                        </td>
                      )}
                      {visibleColumns.Last_Name && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Last_Name}
                        </td>
                      )}
                      {visibleColumns.Email && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Email}
                        </td>
                      )}
                      {visibleColumns.Active_U_Pass_Card && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Active_U_Pass_Card || 'Not Allocated'}
                        </td>
                      )}
                      {visibleColumns.Replaced_U_Pass_Card && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Replaced_U_Pass_Card || 'None'}
                        </td>
                      )}
                      {visibleColumns.Disclaimer_Signed && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.Disclaimer_Signed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.Disclaimer_Signed ? 'Signed' : 'Not Signed'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.Metro_Acct && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Metro_Acct || 'None'}
                        </td>
                      )}
                      {visibleColumns.Distribution_Date && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Distribution_Date || 'Not Distributed'}
                        </td>
                      )}
                      {visibleColumns.Picked_Up_By && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Picked_Up_By || 'Not Picked Up'}
                        </td>
                      )}
                      {visibleColumns.Notes && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.Notes || 'No Notes'}
                        </td>
                      )}
                      {visibleColumns.U_Pass_ID && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.U_Pass_ID || 'None'}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{records.length}</span> of{' '}
                  <span className="font-medium">{pagination.totalRecords}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`px-3 py-1 rounded ${
                    pagination.hasPrevPage 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-[#861F41] text-white rounded">
                  {pagination.page}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`px-3 py-1 rounded ${
                    pagination.hasNextPage 
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message input and send button */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-[#861F41]">Compose Notification</h2>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your notification message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#861F41] focus:border-transparent"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedRecords.length} recipient{selectedRecords.length !== 1 ? 's' : ''} selected
            </div>
            <button
              onClick={handleSendNotification}
              disabled={sendingNotification || selectedRecords.length === 0 || !message.trim()}
              className={`px-4 py-2 rounded ${
                sendingNotification || selectedRecords.length === 0 || !message.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#861F41] text-white hover:bg-[#6e1935]'
              } transition`}
            >
              {sendingNotification ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
