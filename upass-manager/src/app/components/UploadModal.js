/**
 * @file UploadModal component for file upload functionality
 * @description Provides a modal interface for uploading files via drag-and-drop or file browser
 * @module app/components/UploadModal
 */
import React, { useState } from 'react';

/**
 * Modal component for file uploads with drag-and-drop functionality
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onFileChange - Function to call when a file is selected
 * @param {Function} props.onUpload - Function to call when the upload button is clicked
 * @param {File|null} props.selectedFile - The currently selected file object
 * @returns {React.ReactElement|null} The UploadModal component or null if not open
 * 
 * @example
 * <UploadModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onFileChange={handleFileChange}
 *   onUpload={handleUpload}
 *   selectedFile={selectedFile}
 * />
 */
const UploadModal = ({ isOpen, onClose, onFileChange, onUpload, selectedFile }) => {
  const [dragging, setDragging] = useState(false);

  /**
   * Handle dragover event for the drop zone
   * @param {React.DragEvent<HTMLDivElement>} e - The dragover event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  /**
   * Handle dragleave event for the drop zone
   */
  const handleDragLeave = () => {
    setDragging(false);
  };

  /**
   * Handle file drop event for the drop zone
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    onFileChange({ target: { files: [file] } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 items-center justify-center">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Upload File</h2>
        <div
          className={`mb-2 p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${dragging ? 'border-green-500' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={onFileChange}
          />
          <p className="mt-2 text-gray-600">Drag and drop a file</p>
          <p className="mt-2 text-gray-600">OR</p>
          <label
            htmlFor="fileInput"
            className="bg-[#861F41] text-white font-bold py-2 px-4 mt-4 rounded cursor-pointer"
          >
            Browse
          </label>
          {selectedFile && <p className="mt-4 text-gray-600 items-center justify-center text-center">Selected file: {selectedFile.name}</p>}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-white text-gray-500 font-bold py-2 px-4 rounded cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-white text-green-700 font-bold py-2 px-4 rounded cursor-pointer"
            onClick={onUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;