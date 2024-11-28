// Set parameters for calculate price
const [parameters, setParameters] = useState({
  material: 'PLA',
  quality: 'Medium',
  supports: 'Yes',
});
const [priceDetails, setPriceDetails] = useState(null);

const handleParametersChange = (updatedParameters) => {
  setParameters(updatedParameters);
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

export default calculatePrice;
