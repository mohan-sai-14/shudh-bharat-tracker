import { AQIData, WQIData } from '@/types';

// Real OpenAQ API implementation
export const fetchAQIData = async (lat: number, lon: number): Promise<AQIData> => {
  try {
    const radius = 25; // 25km radius
    const baseUrl = 'https://api.openaq.org/v2/locations';
    const url = `${baseUrl}?coordinates=${lat},${lon}&radius=${radius}&limit=1&order_by=lastUpdated`;

    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': 'bebeb02e471dd66dec810c97ac5afea40af6af63b9453ae81683496b6973ba0e'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AQI data');
    }

    const data = await response.json();
    const location = data.results[0];

    if (!location || !location.parameters) {
      throw new Error('No air quality data available for this location');
    }

    // Convert OpenAQ parameters to our format
    const components = {
      pm2_5: location.parameters.find((p: any) => p.parameter === 'pm25')?.lastValue || 0,
      pm10: location.parameters.find((p: any) => p.parameter === 'pm10')?.lastValue || 0,
      no2: location.parameters.find((p: any) => p.parameter === 'no2')?.lastValue || 0,
      so2: location.parameters.find((p: any) => p.parameter === 'so2')?.lastValue || 0,
      co: location.parameters.find((p: any) => p.parameter === 'co')?.lastValue || 0,
      o3: location.parameters.find((p: any) => p.parameter === 'o3')?.lastValue || 0
    };

    // Calculate AQI using PM2.5 as primary indicator
    const aqi = Math.round(components.pm2_5 * 4.5); // Simplified AQI calculation

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

// Keep WQI data simulated but make it more realistic
export const fetchWQIData = async (lat: number, lon: number): Promise<WQIData> => {
  try {
    await delay(200);

    // Use location to generate semi-random but consistent data
    const seed = Math.abs(Math.sin(lat * lon));
    const baseWQI = 30 + Math.floor(seed * 70);

    const components = {
      ph: 6.5 + (seed * 2), // pH between 6.5 and 8.5
      dissolved_oxygen: 6 + (seed * 4), // DO between 6 and 10 mg/L
      turbidity: seed * 10, // 0-10 NTU
      total_dissolved_solids: 200 + (seed * 300), // TDS between 200-500 mg/L
      nitrates: seed * 5, // 0-5 mg/L
      fecal_coliform: seed * 100 // 0-100 CFU/100mL
    };

    return {
      wqi: baseWQI,
      components,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching WQI data:', error);
    throw new Error('Failed to fetch WQI data');
  }
};

// Helper functions (unchanged)
export const getCityCoordinates = async (city: string): Promise<{lat: number, lng: number}> => {
  try {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=4fb59c9232664f91a0e0e65d80dff0d4`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    }
    throw new Error('City not found');
  } catch (error) {
    console.error('Error getting city coordinates:', error);
    return { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
  }
};

// Helper functions remain unchanged
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

export const getWQICategory = (wqi: number): {category: string, color: string} => {
  if (wqi <= 50) {
    return { category: 'Excellent', color: '#4CAF50' };
  } else if (wqi <= 100) {
    return { category: 'Good', color: '#8BC34A' };
  } else if (wqi <= 150) {
    return { category: 'Fair', color: '#FFEB3B' };
  } else if (wqi <= 200) {
    return { category: 'Poor', color: '#FF9800' };
  } else if (wqi <= 300) {
    return { category: 'Very Poor', color: '#F44336' };
  } else {
    return { category: 'Unsuitable', color: '#7D1919' };
  }
};

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));