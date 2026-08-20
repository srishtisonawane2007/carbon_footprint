// =========================================================
// IPCC & EPA Standard Emission Factor Calculation Engine (Client Utility)
// =========================================================

export const EMISSION_FACTORS = {
  Transport: {
    'Car commute (Petrol/Diesel)': { unit: 'km', factor: 0.210 },
    'Car drive (EV)': { unit: 'km', factor: 0.053 },
    'Metro commute': { unit: 'km', factor: 0.070 },
    'Public Bus': { unit: 'km', factor: 0.089 },
    'Motorcycle': { unit: 'km', factor: 0.113 },
  },
  Electricity: {
    'Grid Electricity': { unit: 'kWh', factor: 0.820 },
    'Solar home power': { unit: 'kWh', factor: 0.000 },
    'Wind Power': { unit: 'kWh', factor: 0.012 },
    'LPG Cooking Gas': { unit: 'kg', factor: 2.980 },
  },
  Food: {
    'Vegan meal': { unit: 'meal', factor: 0.400 },
    'Vegetarian meal': { unit: 'meal', factor: 0.850 },
    'Meat / Poultry meal': { unit: 'meal', factor: 2.300 },
    'Beef meal': { unit: 'meal', factor: 4.500 },
  },
  Travel: {
    'Flight (Domestic/Short)': { unit: 'flight', factor: 180.000 },
    'Flight (International)': { unit: 'flight', factor: 650.000 },
    'Train Journey (Long)': { unit: 'km', factor: 0.041 },
  },
  Shopping: {
    'Clothing / Retail': { unit: '$', factor: 0.450 },
    'Electronics': { unit: '$', factor: 0.800 },
    'Paper & Packaging': { unit: 'kg', factor: 1.200 },
  }
};

export function calculateEmissions(category, activityType, quantity) {
  const cat = EMISSION_FACTORS[category];
  if (!cat) return 0;
  
  const activity = cat[activityType];
  if (!activity) {
    return parseFloat((quantity * 0.25).toFixed(2));
  }
  
  return parseFloat((quantity * activity.factor).toFixed(2));
}
