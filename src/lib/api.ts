import { AQIData, WQIData } from '@/types';

// Simulate fetching AQI data from OpenWeatherMap
export const fetchAQIData = async (lat: number, lon: number): Promise<AQIData> => {
  try {
    // In a real implementation, this would call the OpenWeatherMap API
    // For now, we'll simulate a response with realistic data
    await delay(200); // Reduced delay for multiple location fetching
    
    const pollutionLevel = Math.random();
    let aqi;
    let components;
    
    // Use location to add some predictable variation
    const locationFactor = (lat * 10 + lon) % 10;
    const baseAQI = locationFactor < 3 ? 30 : 
                    locationFactor < 6 ? 80 : 
                    locationFactor < 8 ? 120 : 180;
    
    if (pollutionLevel < 0.3) {
      // Good air quality
      aqi = Math.floor(Math.random() * 30) + baseAQI;
      components = {
        pm2_5: Math.random() * 10,
        pm10: Math.random() * 20,
        no2: Math.random() * 20,
        so2: Math.random() * 8,
        co: Math.random() * 600,
        o3: Math.random() * 30
      };
    } else if (pollutionLevel < 0.7) {
      // Moderate air quality
      aqi = Math.floor(Math.random() * 30) + baseAQI;
      components = {
        pm2_5: 10 + Math.random() * 20,
        pm10: 20 + Math.random() * 30,
        no2: 20 + Math.random() * 30,
        so2: 8 + Math.random() * 12,
        co: 600 + Math.random() * 1000,
        o3: 30 + Math.random() * 40
      };
    } else {
      // Poor air quality
      aqi = Math.floor(Math.random() * 50) + baseAQI;
      components = {
        pm2_5: 30 + Math.random() * 70,
        pm10: 50 + Math.random() * 100,
        no2: 50 + Math.random() * 100,
        so2: 20 + Math.random() * 30,
        co: 1600 + Math.random() * 5000,
        o3: 70 + Math.random() * 50
      };
    }
    
    return {
      aqi,
      components,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw new Error('Failed to fetch AQI data');
  }
};

// Simulate fetching WQI data
export const fetchWQIData = async (lat: number, lon: number): Promise<WQIData> => {
  try {
    // Simulate network delay
    await delay(200); // Reduced delay for multiple location fetching
    
    // Use location to add some predictable variation
    const locationFactor = (lat * 10 + lon) % 10;
    const baseWQI = locationFactor < 3 ? 40 : 
                    locationFactor < 6 ? 70 : 
                    locationFactor < 8 ? 130 : 160;
    
    const qualityLevel = Math.random();
    let wqi = Math.floor(Math.random() * 40) + baseWQI;
    let components;
    
    if (wqi <= 50) {
      // Good water quality
      components = {
        ph: 6.5 + Math.random() * 1.5,
        dissolved_oxygen: 7 + Math.random() * 3,
        turbidity: Math.random() * 5,
        total_dissolved_solids: Math.random() * 300,
        nitrates: Math.random() * 5,
        fecal_coliform: Math.random() * 10
      };
    } else if (wqi <= 100) {
      // Moderate water quality
      components = {
        ph: 6 + Math.random() * 3,
        dissolved_oxygen: 5 + Math.random() * 2,
        turbidity: 5 + Math.random() * 10,
        total_dissolved_solids: 300 + Math.random() * 300,
        nitrates: 5 + Math.random() * 5,
        fecal_coliform: 10 + Math.random() * 90
      };
    } else {
      // Poor water quality
      components = {
        ph: 5 + Math.random() * 4,
        dissolved_oxygen: 2 + Math.random() * 3,
        turbidity: 15 + Math.random() * 25,
        total_dissolved_solids: 600 + Math.random() * 400,
        nitrates: 10 + Math.random() * 10,
        fecal_coliform: 100 + Math.random() * 400
      };
    }
    
    return {
      wqi,
      components,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching WQI data:', error);
    throw new Error('Failed to fetch WQI data');
  }
};

// Helper to get city coordinates
export const getCityCoordinates = async (city: string): Promise<{lat: number, lng: number}> => {
  // In a real app, this would call a geocoding API
  // For now, return some default coordinates for cities not in our list
  await delay(300);
  return { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
};

// Helper to get AQI category and color
export const getAQICategory = (aqi: number): {category: string, color: string} => {
  if (aqi <= 50) {
    return { category: 'Good', color: '#4CAF50' }; // Green
  } else if (aqi <= 100) {
    return { category: 'Moderate', color: '#FFEB3B' }; // Yellow
  } else if (aqi <= 150) {
    return { category: 'Unhealthy for Sensitive Groups', color: '#FF9800' }; // Orange
  } else if (aqi <= 200) {
    return { category: 'Unhealthy', color: '#F44336' }; // Red
  } else if (aqi <= 300) {
    return { category: 'Very Unhealthy', color: '#9C27B0' }; // Purple
  } else {
    return { category: 'Hazardous', color: '#7D1919' }; // Maroon
  }
};

// Helper to get WQI category and color
export const getWQICategory = (wqi: number): {category: string, color: string} => {
  if (wqi <= 50) {
    return { category: 'Excellent', color: '#4CAF50' }; // Green
  } else if (wqi <= 100) {
    return { category: 'Good', color: '#8BC34A' }; // Light Green
  } else if (wqi <= 150) {
    return { category: 'Fair', color: '#FFEB3B' }; // Yellow
  } else if (wqi <= 200) {
    return { category: 'Poor', color: '#FF9800' }; // Orange
  } else if (wqi <= 300) {
    return { category: 'Very Poor', color: '#F44336' }; // Red
  } else {
    return { category: 'Unsuitable', color: '#7D1919' }; // Dark Red
  }
};

// Get AQI health impact message
export const getAQIHealthMessage = (aqi: number): string => {
  if (aqi <= 50) {
    return "Air quality is satisfactory. Enjoy outdoor activities!";
  } else if (aqi <= 100) {
    return "Air quality is acceptable. Consider reducing prolonged outdoor activities if you're sensitive to pollution.";
  } else if (aqi <= 150) {
    return "Children, elderly, and individuals with respiratory diseases should limit outdoor exertion.";
  } else if (aqi <= 200) {
    return "Everyone may begin to experience health effects. Limit outdoor activities.";
  } else if (aqi <= 300) {
    return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
  } else {
    return "EMERGENCY: Everyone should avoid all outdoor physical activities and stay indoors.";
  }
};

// Get WQI impact message
export const getWQIHealthMessage = (wqi: number): string => {
  if (wqi <= 50) {
    return "Water quality is excellent. Safe for drinking and recreational activities.";
  } else if (wqi <= 100) {
    return "Water quality is good. Generally safe, but minor treatment recommended.";
  } else if (wqi <= 150) {
    return "Water requires treatment before drinking. OK for most recreational activities.";
  } else if (wqi <= 200) {
    return "Water requires significant treatment. Limit direct contact.";
  } else if (wqi <= 300) {
    return "Water is highly polluted. Avoid contact and do not consume without extensive treatment.";
  } else {
    return "Water is severely contaminated. Not suitable for any use without intensive treatment.";
  }
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
