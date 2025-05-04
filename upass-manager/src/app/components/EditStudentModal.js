/**
 * @file EditStudentModal component for editing student UPass information
 * @description Modal component that allows administrators to edit student information related to UPass cards,
 *              including active cards, replacement status, disclaimer signature, and distribution details
 * @module app/components/EditStudentModal
 */
"use client";

import React, { useState, useEffect } from 'react';
import { maskPid } from '../utils/maskPid';

/**
 * Modal component for editing student UPass record information
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onSave - Function to call when the form is submitted with updated student data
 * @param {Object} props.studentInfo - Student record information
 * @param {string} props.studentInfo.Student_ID - Student's ID (PID)
 * @param {string} props.studentInfo.First_Name - Student's first name
 * @param {string} props.studentInfo.Last_Name - Student's last name
 * @param {string} props.studentInfo.Email - Student's email address
 * @param {string} [props.studentInfo.Active_U_Pass_Card] - Student's current UPass card number
 * @param {string} [props.studentInfo.Replaced_U_Pass_Card] - Student's replaced UPass card number
 * @param {boolean} [props.studentInfo.Disclaimer_Signed] - Whether student has signed disclaimer
 * @param {string} [props.studentInfo.Metro_Acct] - Student's Metro account information
 * @param {string} [props.studentInfo.Distribution_Date] - Date UPass was distributed
 * @param {string} [props.studentInfo.Picked_Up_By] - Person who picked up the UPass
 * @param {string} [props.studentInfo.Notes] - Additional notes about the student
 * @param {string} [props.studentInfo.U_Pass_ID] - Internal UPass ID reference
 * @returns {React.ReactElement|null} The EditStudentModal component or null if not open
 * 
 * @example
 * <EditStudentModal
 *   isOpen={showEditModal}
 *   onClose={() => setShowEditModal(false)}
 *   onSave={handleUpdateStudent}
 *   studentInfo={selectedStudent}
 * />
 */
const EditStudentModal = ({ isOpen, onClose, onSave, studentInfo }) => {
  // State for editable fields only
  const [formData, setFormData] = useState({
    Active_U_Pass_Card: '',
    Replaced_U_Pass_Card: '',
    Disclaimer_Signed: false,
    Metro_Acct: '',
    Distribution_Date: '',
    Picked_Up_By: '',
    Notes: '',
    U_Pass_ID: ''
  });
  const [error, setError] = useState(null);
  
  // Initialize form data when student info changes
  useEffect(() => {
    if (studentInfo) {
      // Format the date if it exists and is in ISO format
      let formattedDate = studentInfo.Distribution_Date || '';
      if (formattedDate && formattedDate.includes('T')) {
        formattedDate = formattedDate.split('T')[0]; // Extract YYYY-MM-DD part
      }
      
      setFormData({
        Active_U_Pass_Card: studentInfo.Active_U_Pass_Card || '',
        Replaced_U_Pass_Card: studentInfo.Replaced_U_Pass_Card || '',
        Disclaimer_Signed: Boolean(studentInfo.Disclaimer_Signed),
        Metro_Acct: studentInfo.Metro_Acct || '',
        Distribution_Date: formattedDate,
        Picked_Up_By: studentInfo.Picked_Up_By || '',
        Notes: studentInfo.Notes || '',
        U_Pass_ID: studentInfo.U_Pass_ID || ''
      });
    }
  }, [studentInfo]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = () => {
    // Validate Active UPass if provided
    if (formData.Active_U_Pass_Card && !/^\d{20}$/.test(formData.Active_U_Pass_Card)) {
      setError('Active U-Pass must be a 20-digit number');
      return;
    }
    
    // Validate Replaced UPass if provided
    if (formData.Replaced_U_Pass_Card && !/^\d{20}$/.test(formData.Replaced_U_Pass_Card)) {
      setError('Replaced U-Pass must be a 20-digit number');
      return;
    }
    
    // Ensure UPass numbers are passed as strings
    const updatedData = {
      ...studentInfo,
      ...formData,
      Active_U_Pass_Card: formData.Active_U_Pass_Card ? String(formData.Active_U_Pass_Card) : '',
      Replaced_U_Pass_Card: formData.Replaced_U_Pass_Card ? String(formData.Replaced_U_Pass_Card) : ''
    };
    
    // Call the save handler with the updated data
    onSave(updatedData);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#861F41]">Edit Student Record</h2>
        
        {/* Read-only student information section */}
        {studentInfo && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Student Information</h3>
            <div className="bg-gray-100 p-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">{maskPid(studentInfo.Student_ID)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{studentInfo.First_Name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{studentInfo.Last_Name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{studentInfo.Email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Editable fields section */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Active U-Pass
              </label>
              <input
                type="text"
                name="Active_U_Pass_Card"
                value={formData.Active_U_Pass_Card}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Replaced U-Pass
              </label>
              <input
                type="text"
                name="Replaced_U_Pass_Card"
                value={formData.Replaced_U_Pass_Card}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disclaimer Signed
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="Disclaimer_Signed"
                  checked={formData.Disclaimer_Signed}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#861F41] focus:ring-[#861F41] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {formData.Disclaimer_Signed ? 'Signed' : 'Not Signed'}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metro Account
              </label>
              <input
                type="text"
                name="Metro_Acct"
                value={formData.Metro_Acct}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distribution Date
              </label>
              <input
                type="date"
                name="Distribution_Date"
                value={formData.Distribution_Date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Picked Up By
              </label>
              <input
                type="text"
                name="Picked_Up_By"
                value={formData.Picked_Up_By}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                U-Pass ID
              </label>
              <input
                type="text"
                name="U_Pass_ID"
                value={formData.U_Pass_ID}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="Notes"
              value={formData.Notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
            ></textarea>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
