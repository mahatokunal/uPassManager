"use client";

import React, { useState, useEffect, useRef } from 'react';
import { maskPid } from '../utils/maskPid';

const NFCModal = ({ isOpen, onClose, onConfirm, studentInfo }) => {
  const [upassId, setUpassId] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  
  // Focus the input field when the modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setUpassId('');
      setError(null);
    }
  }, [isOpen]);
  
  const handleSubmit = () => {
    // Validate the input
    if (!upassId.trim()) {
      setError('Please enter a U-Pass number');
      return;
    }
    
    // Convert to number and validate
    const numericUpassId = Number(upassId);
    if (isNaN(numericUpassId)) {
      setError('U-Pass number must be numeric');
      return;
    }
    
    // Call the confirm handler with the numeric U-Pass ID
    onConfirm(numericUpassId);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-[#861F41]">Allocate U-Pass</h2>
        
        {studentInfo && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">
              Allocating U-Pass for:
            </p>
            <div className="bg-gray-100 p-3 rounded">
              <p><span className="font-medium">Name:</span> {studentInfo.First_Name} {studentInfo.Last_Name}</p>
              <p><span className="font-medium">PID:</span> {maskPid(studentInfo.Student_ID)}</p>
              <p><span className="font-medium">Email:</span> {studentInfo.Email}</p>
            </div>
          </div>
        )}
        
        <div className="my-6">
          <label htmlFor="upassId" className="block text-sm font-medium text-gray-700 mb-2">
            U-Pass Number
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="upassId"
              name="upassId"
              value={upassId}
              onChange={(e) => setUpassId(e.target.value)}
              placeholder="Scan or enter U-Pass number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#861F41] focus:border-transparent"
              autoComplete="off"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Place the U-Pass card near the NFC reader or manually enter the U-Pass number
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#861F41] text-white rounded hover:bg-[#6e1935] transition"
          >
            Allocate U-Pass
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFCModal;
