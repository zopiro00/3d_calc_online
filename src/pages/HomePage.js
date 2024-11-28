// src/pages/HomePage.js
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ThreeDViewer from '../components/ThreeDViewer';
import ParameterForm from '../components/ParameterForm';
import PriceSummary from '../components/PriceSummary';
import './HomePage.css';

// To check is server is correct: console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

const HomePage = () => {
  const [file, setFile] = useState(null); // Actual file object for backend server
  const [fileUrl, setFileUrl] = useState(null); // Object URL for ThreeDViewer
  const [alignToPlane, setAlignToPlane] = useState(false); //Set Align to Plane
  const [rotationX, setRotationX] = useState(0); // Rotation angle for X axis
  const [rotationY, setRotationY] = useState(0); // Rotation angle for Y axis

  // Set parameters for calculate price
  const [parameters, setParameters] = useState({
    material: 'PLA',
    quality: 'Medium',
    supports: 'Yes',
  });
  const [priceDetails, setPriceDetails] = useState(null);

  const handleFileUpload = (uploadedFile) => {
    if (uploadedFile) {
      // Create an object URL for the 3D Viewer
      const objectUrl = URL.createObjectURL(uploadedFile);
      setFileUrl(objectUrl); // For ThreeDViewer
      setFile(uploadedFile); // For backend server
    }
  };

  const handleParametersChange = (updatedParameters) => {
    setParameters(updatedParameters);
  };

  const [loading, setLoading] = useState(false);

  // Logic of the button Align to plane
  const handleAlignToPlane = () => {
    setAlignToPlane(true); // Trigger alignment
  };

  // Logic rotate X
  const rotateX = (direction) => {
    setRotationX((prev) => prev + direction * (Math.PI / 8)); // Rotate positively or negatively
  };

  // Logic Rotate Y
  const rotateY = (direction) => {
    setRotationY((prev) => prev + direction * (Math.PI / 8)); // Rotate positively or negatively
  };

  // This function call the backend server to calculate the price of the printing.
  const calculatePrice = async () => {
    if (!file) {
      console.error('File is not selected.');
      return;
    }

    // Validate parameters
    if (!parameters.material || !parameters.quality || !parameters.supports) {
      console.error('Parameters are incomplete:', parameters);
      alert('Please ensure all parameters are selected.');
      return;
    }
    setLoading(true); // Set loading state to true
    const formData = new FormData();
    formData.append('file', file);
    formData.append('material', parameters.material);
    formData.append('quality', parameters.quality);
    formData.append('supports', parameters.supports);

    //Debugging code
    console.log('Request Payload:', {
      file,
      material: parameters.material,
      quality: parameters.quality,
      supports: parameters.supports,
    });

    //console.log('Sending request to backend...'); // Debugging

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/calculate`,
        {
          method: 'POST',
          body: formData,
        }
      );

      //console.log('Received response:', response); // Debugging

      if (!response.ok) {
        const errorDetails = await response.json();
        alert(errorDetails.error || 'Error calculating price.');
        return;
      }

      const data = await response.json();
      //console.log('Response Data:', data); // Debugging
      setPriceDetails(data);
    } catch (error) {
      //console.error('Error in calculatePrice:', error.message);
      alert('Failed to calculate price.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

  return (
    <div className="container">
      <div className="column form-column">
        <h1>3D Printing Price Calculator</h1>
        <div class="fileUpload">
          <p>Upload a 3D model to calculate its price.</p>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
        <div class="fileControl">
          <button class="button" onClick={handleAlignToPlane} disabled={!file}>
            Set to ground plane
          </button>
          <div class="position">
            <button onClick={() => rotateX(1)} disabled={!file}>
              Rotate X +
            </button>
            <button onClick={() => rotateX(-1)} disabled={!file}>
              Rotate X -
            </button>
            <button onClick={() => rotateY(1)} disabled={!file}>
              Rotate Y +
            </button>
            <button onClick={() => rotateY(-1)} disabled={!file}>
              Rotate Y -
            </button>
          </div>
        </div>
        <ParameterForm onParametersChange={handleParametersChange} />
        <button onClick={calculatePrice} disabled={!file || loading}>
          {loading ? 'Calculating...' : 'Calculate Price'}
        </button>
        <PriceSummary priceDetails={priceDetails} />
      </div>
      <div className="column preview-column">
        {file ? (
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
