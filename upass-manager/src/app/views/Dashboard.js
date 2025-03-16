"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadModal from '../components/UploadModal';
import AWS from 'aws-sdk';

const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const region = process.env.NEXT_PUBLIC_REGION;
const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

const Dashboard = () => {
  const [pid, setPid] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      bgColor: "var(--distributor-add-color)",
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
      bgColor: "var(--upload-file-color)",
    },
  ];

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    // Configure AWS SDK
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    });

    const s3 = new AWS.S3();
    const params = {
      Bucket: bucketName,
      Key: `raw_data/${selectedFile.name}`,
      Body: selectedFile,
      ContentType: selectedFile.type,
    };

    try {
      await s3.upload(params).promise();
      alert("File uploaded successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center mx-auto px-10 py-1">
        <div className="flex flex-col items-center w-full max-w-lg mx-auto">
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

        <div className="mt-30 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
          {cardData.map((card, index) => (
            <button
              key={index}
              className="flex items-center p-3 bg-white shadow-md border border-gray-100 rounded-full cursor-pointer"
              style={{ borderRadius: '50px' }}
              onClick={() => {
                if (index === 1) {
                  setIsModalOpen(true);
                } else {
                  alert("This feature is not yet implemented");
                }
              }}
            >
              <div className="rounded-full p-3 mr-4" style={{ backgroundColor: card.bgColor }}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-md font-bold mb-1 text-gray-900 text-left">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-xs text-left">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
      <Footer />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        selectedFile={selectedFile}
      />
    </div>
  );
};

export default Dashboard;