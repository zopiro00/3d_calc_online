import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ThreeDViewer from '../components/ThreeDViewer';
import './HomePage.css';

const HomePage = () => {
  const [fileUrl, setFileUrl] = useState(null); // State to store file URL
  const [alignToPlane, setAlignToPlane] = useState(false); //Set Align to Plane
  const [rotationX, setRotationX] = useState(0); // Rotation angle for X axis
  const [rotationY, setRotationY] = useState(0); // Rotation angle for Y axis

  const handleFileUpload = (file) => {
    if (file) {
      // Create an object URL for the file
      const objectUrl = URL.createObjectURL(file);
      setFileUrl(objectUrl);
    }
  };

  const handleAlignToPlane = () => {
    setAlignToPlane(true); // Trigger alignment
  };

  const rotateX = (direction) => {
    setRotationX((prev) => prev + direction * (Math.PI / 8)); // Rotate positively or negatively
  };

  const rotateY = (direction) => {
    setRotationY((prev) => prev + direction * (Math.PI / 8)); // Rotate positively or negatively
  };

  return (
    <div className="container">
      <div className="column form-column">
        <h1>3D Printing Price Calculator</h1>
        <p>Upload a 3D model to calculate its price.</p>
        <FileUpload onFileUpload={handleFileUpload} />
        <button onClick={handleAlignToPlane} disabled={!fileUrl}>
          Set to ground plane
        </button>
        <button onClick={() => rotateX(1)} disabled={!fileUrl}>
          Rotate X +
        </button>
        <button onClick={() => rotateX(-1)} disabled={!fileUrl}>
          Rotate X -
        </button>
        <button onClick={() => rotateY(1)} disabled={!fileUrl}>
          Rotate Y +
        </button>
        <button onClick={() => rotateY(-1)} disabled={!fileUrl}>
          Rotate Y -
        </button>
      </div>
      <div className="column preview-column">
        {fileUrl ? (
          <ThreeDViewer
            fileUrl={fileUrl}
            alignToPlane={alignToPlane}
            rotationX={rotationX}
            rotationY={rotationY}
          />
        ) : (
          <p>No preview available. Upload a file to see it here.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
