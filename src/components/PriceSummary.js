// src/components/PriceSummary.js
import React from 'react';

const PriceSummary = ({ priceDetails }) => {
  if (!priceDetails) return null;

  return (
    <div>
      <h3>Price Summary</h3>
      <p>Print Time: {priceDetails.printTime}</p>
      <p>Material Used: {priceDetails.materialUsed}</p>
      <p>Total Price: {priceDetails.totalPrice}</p>
    </div>
  );
};

export default PriceSummary;
