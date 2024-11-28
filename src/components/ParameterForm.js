// src/components/ParameterForm.js
import React, { useState } from 'react';
import '../pages/HomePage.css';

const ParameterForm = ({ onParametersChange }) => {
  const [parameters, setParameters] = useState({
    material: 'PLA',
    quality: 'Medium',
    supports: 'Yes',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedParameters = { ...parameters, [name]: value };
    setParameters(updatedParameters);
    onParametersChange(updatedParameters);
  };

  return (
    <div>
      <h3>Select Printing Parameters</h3>
      <label>
        Material:
        <select
          name="material"
          value={parameters.material}
          onChange={handleChange}
        >
          <option value="PLA">PLA</option>
          <option value="ABS">ABS</option>
        </select>
      </label>
      <label>
        Quality:
        <select
          name="quality"
          value={parameters.quality}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>
      <label>
        Supports:
        <select
          name="supports"
          value={parameters.supports}
          onChange={handleChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>
    </div>
  );
};

export default ParameterForm;
