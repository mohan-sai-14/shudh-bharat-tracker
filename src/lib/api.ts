import { AQIData, WQIData, PollutionHotspot, StatePollutionData } from '@/types';

// Real OpenAQ API implementation with error handling
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No air quality data available for this location');
    }

    const location = data.results[0];
    const parameters = location.parameters || [];

    const components = {
      pm2_5: parameters.find((p: any) => p.parameter === 'pm25')?.lastValue || 0,
      pm10: parameters.find((p: any) => p.parameter === 'pm10')?.lastValue || 0,
      no2: parameters.find((p: any) => p.parameter === 'no2')?.lastValue || 0,
      so2: parameters.find((p: any) => p.parameter === 'so2')?.lastValue || 0,
      co: parameters.find((p: any) => p.parameter === 'co')?.lastValue || 0,
      o3: parameters.find((p: any) => p.parameter === 'o3')?.lastValue || 0
    };

    // Calculate AQI using PM2.5 as primary indicator
    const aqi = Math.round((components.pm2_5 * 4.5) + (components.pm10 * 2.5));

    return {
      aqi,
      components,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw new Error(`Failed to fetch AQI data: ${error.message}`);
  }
};

// WQI data with more realistic simulated values
export const fetchWQIData = async (lat: number, lon: number): Promise<WQIData> => {
  try {
    const seed = Math.abs(Math.sin(lat * lon));
    const baseWQI = 30 + Math.floor(seed * 70);

    const components = {
      ph: 6.5 + (seed * 2),
      dissolved_oxygen: 6 + (seed * 4),
      turbidity: seed * 10,
      total_dissolved_solids: 200 + (seed * 300),
      nitrates: seed * 5,
      fecal_coliform: seed * 100
    };

    return {
      wqi: baseWQI,
      components,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating WQI data:', error);
    throw new Error('Failed to generate WQI data');
  }
};

// Add state pollution data
export const fetchStatePollutionData = async (): Promise<StatePollutionData[]> => {
  const stateData: StatePollutionData[] = [
    {
      state: "Delhi",
      averageAQI: 165,
      averageWQI: 145,
      hotspots: [
        {
          id: "1",
          location: "Anand Vihar",
          lat: 28.6469,
          lng: 77.3161,
          aqi: 195,
          wqi: 155,
          severity: "Critical",
          description: "Industrial and traffic pollution hotspot",
          recommendations: ["Wear N95 masks", "Avoid outdoor activities"]
        },
        {
          id: "2",
          location: "Punjabi Bagh",
          lat: 28.6672,
          lng: 77.1311,
          aqi: 175,
          wqi: 135,
          severity: "High",
          description: "Heavy traffic area with poor air quality",
          recommendations: ["Use air purifiers", "Keep windows closed"]
        }
      ],
      lastUpdated: new Date().toISOString()
    },
    {
      state: "Maharashtra",
      averageAQI: 120,
      averageWQI: 110,
      hotspots: [
        {
          id: "3",
          location: "Chandrapur",
          lat: 19.9615,
          lng: 79.2961,
          aqi: 160,
          wqi: 130,
          severity: "High",
          description: "Industrial area with thermal power plants",
          recommendations: ["Use masks outdoors", "Monitor air quality"]
        }
      ],
      lastUpdated: new Date().toISOString()
    }
    // Add more states as needed
  ];

  return stateData;
};

export const getCityCoordinates = async (city: string): Promise<{lat: number, lng: number}> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=4fb59c9232664f91a0e0e65d80dff0d4`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  } catch (error) {
    console.error('Error getting city coordinates:', error);
    throw new Error(`Failed to get coordinates: ${error.message}`);
  }
};

// Helper functions remain unchanged
export const getAQICategory = (aqi: number): {category: string, color: string} => {
  if (aqi <= 50) return { category: 'Good', color: '#4CAF50' };
  if (aqi <= 100) return { category: 'Moderate', color: '#FFEB3B' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#FF9800' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#F44336' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#9C27B0' };
  return { category: 'Hazardous', color: '#7D1919' };
};

export const getWQICategory = (wqi: number): {category: string, color: string} => {
  if (wqi <= 50) return { category: 'Excellent', color: '#4CAF50' };
  if (wqi <= 100) return { category: 'Good', color: '#8BC34A' };
  if (wqi <= 150) return { category: 'Fair', color: '#FFEB3B' };
  if (wqi <= 200) return { category: 'Poor', color: '#FF9800' };
  if (wqi <= 300) return { category: 'Very Poor', color: '#F44336' };
  return { category: 'Unsuitable', color: '#7D1919' };
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