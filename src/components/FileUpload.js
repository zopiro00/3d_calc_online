// src/components/FileUpload.js
import React from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    const validExtensions = ['stl', 'obj', '3mf']; // Supported file formats

    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase(); // Extract file extension
      if (!validExtensions.includes(fileExtension)) {
        alert('Invalid file format. Please upload a .stl, .obj, or .3mf file.'); // Notify the user
        return;
      }
      onFileUpload(file); // If valid, pass the file to the parent component
    }
  };

  return (
    <div>
      <h3>Upload Your 3D File</h3>
      <input
        type="file"
        accept=".stl,.obj,.3mf" // Restrict selectable file types in the file picker
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
