import React, { useState } from 'react';

/**
 * Modal component for file uploads in the UPass Manager application
 * 
 * This component provides a drag-and-drop interface for file uploads,
 * with visual feedback during interactions and file selection.
 * 
 * @component
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {Function} props.onFileChange - Callback function triggered when a file is selected
 * @param {Function} props.onUpload - Callback function to handle file upload
 * @param {File|null} props.selectedFile - Currently selected file object, if any
 * @returns {JSX.Element|null} The rendered modal or null if closed
 * 
 * @example
 * // Basic usage in a parent component
 * const [isModalOpen, setIsModalOpen] = useState(false);
 * const [selectedFile, setSelectedFile] = useState(null);
 * 
 * const handleFileChange = (e) => {
 *   setSelectedFile(e.target.files[0]);
 * };
 * 
 * const handleUpload = async () => {
 *   if (!selectedFile) return;
 *   // Upload logic here
 *   setIsModalOpen(false);
 * };
 * 
 * return (
 *   <>
 *     <button onClick={() => setIsModalOpen(true)}>Upload File</button>
 *     <UploadModal
 *       isOpen={isModalOpen}
 *       onClose={() => setIsModalOpen(false)}
 *       onFileChange={handleFileChange}
 *       onUpload={handleUpload}
 *       selectedFile={selectedFile}
 *     />
 *   </>
 * );
 */
const UploadModal = ({ isOpen, onClose, onFileChange, onUpload, selectedFile }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

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