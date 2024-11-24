import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ThreeDViewer from '../components/ThreeDViewer';
import './HomePage.css';

const HomePage = () => {
  const [fileUrl, setFileUrl] = useState(null); // State to store file URL

  const handleFileUpload = (file) => {
    if (file) {
      // Create an object URL for the file
      const objectUrl = URL.createObjectURL(file);
      setFileUrl(objectUrl);
    }
  };

  return (
    <div className="container">
      <div className="column form-column">
        <h1>3D Printing Price Calculator</h1>
        <FileUpload onFileUpload={handleFileUpload} />
        <p>Upload a 3D model to calculate its price.</p>
      </div>
      <div className="column preview-column">
        {fileUrl ? (
          <ThreeDViewer fileUrl={fileUrl} />
        ) : (
          <p>No preview available. Upload a file to see it here.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
