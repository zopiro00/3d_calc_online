//Calculates the price of the printing.
// util/pricing.js

// Pricing logic based on material, quality, and supports
const calculatePrice = (
  { filamentUsed, estimatedTime },
  material,
  quality,
  supports
) => {
  const materialCosts = {
    PLA: 0.05,
    ABS: 0.07,
    PETG: 0.06,
  };

  const machineTimeCostPerHour = 1.5;
  const qualityMultiplier = {
    low: 0.8,
    medium: 1.0,
    high: 1.2,
  };

  const filamentDiameter = 1.75; // mm
  const filamentDensity = 1.24; // g/cm³ (PLA as default)
  const filamentVolume =
    (Math.PI * Math.pow(filamentDiameter / 2, 2) * filamentUsed) / 1000; // cm³
  const filamentWeight = filamentVolume * filamentDensity; // grams

  const materialCost = filamentWeight * (materialCosts[material] || 0.02);

  const timeMatch = estimatedTime.match(/(\d+)h (\d+)m (\d+)s/);
  const hours =
    timeMatch && timeMatch.length === 4
      ? parseInt(timeMatch[1]) +
        parseInt(timeMatch[2]) / 60 +
        parseInt(timeMatch[3]) / 3600
      : 0;

  const machineUsageCost =
    hours * machineTimeCostPerHour * qualityMultiplier[quality.toLowerCase()];

  const supportCost = supports.toLowerCase() === 'yes' ? materialCost * 0.1 : 0;

  const totalPrice = materialCost + machineUsageCost + supportCost;

  return totalPrice.toFixed(2);
};

module.exports = { calculatePrice };
