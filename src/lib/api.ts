
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
      // Return simulated data if no real data available
      return simulateAQIData(lat, lon);
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

    const aqi = calculateAQI(components);

    return {
      aqi,
      components,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    return simulateAQIData(lat, lon);
  }
};

const calculateAQI = (components: any): number => {
  // Basic AQI calculation based on PM2.5 and PM10
  const pm25Index = components.pm2_5 * 4.5;
  const pm10Index = components.pm10 * 2.5;
  return Math.round(Math.max(pm25Index, pm10Index));
};

const simulateAQIData = (lat: number, lon: number): AQIData => {
  const seed = Math.abs(Math.sin(lat * lon));
  const baseAQI = 30 + Math.floor(seed * 200);

  return {
    aqi: baseAQI,
    components: {
      pm2_5: baseAQI / 4.5,
      pm10: baseAQI / 2.5,
      no2: seed * 50,
      so2: seed * 40,
      co: seed * 10,
      o3: seed * 60
    },
    timestamp: new Date().toISOString()
  };
};

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

export const fetchStatePollutionData = async (): Promise<StatePollutionData[]> => {
  const allStates = [
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Maharashtra", lat: 19.7515, lng: 75.7139 },
    { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    { name: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    { name: "Karnataka", lat: 12.9716, lng: 77.5946 },
    { name: "Gujarat", lat: 23.2156, lng: 72.6369 },
    { name: "West Bengal", lat: 22.5726, lng: 88.3639 },
    { name: "Rajasthan", lat: 26.9124, lng: 75.7873 },
    { name: "Punjab", lat: 30.9010, lng: 75.8573 },
    { name: "Bihar", lat: 25.5941, lng: 85.1376 },
    { name: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
    { name: "Telangana", lat: 17.3850, lng: 78.4867 },
    { name: "Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
    { name: "Odisha", lat: 20.2961, lng: 85.8245 },
    { name: "Kerala", lat: 8.5241, lng: 76.9366 },
    { name: "Jharkhand", lat: 23.3441, lng: 85.3096 },
    { name: "Assam", lat: 26.2006, lng: 92.9376 },
    { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661 },
    { name: "Haryana", lat: 30.7333, lng: 76.7794 },
    { name: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
    { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
    { name: "Goa", lat: 15.2993, lng: 74.1240 },
    { name: "Tripura", lat: 23.8315, lng: 91.2868 },
    { name: "Meghalaya", lat: 25.5788, lng: 91.8933 },
    { name: "Manipur", lat: 24.6637, lng: 93.9063 },
    { name: "Nagaland", lat: 26.1584, lng: 94.5624 },
    { name: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053 },
    { name: "Mizoram", lat: 23.1645, lng: 92.9376 },
    { name: "Sikkim", lat: 27.3389, lng: 88.6065 }
  ];

  const stateData: StatePollutionData[] = await Promise.all(
    allStates.map(async (state) => {
      const aqi = await fetchAQIData(state.lat, state.lng);
      const wqi = await fetchWQIData(state.lat, state.lng);

      const cityHotspots = await generateHotspotsForState(state.name, state.lat, state.lng);

      return {
        state: state.name,
        averageAQI: aqi.aqi,
        averageWQI: wqi.wqi,
        hotspots: cityHotspots,
        lastUpdated: new Date().toISOString()
      };
    })
  );

  return stateData.sort((a, b) => b.averageAQI - a.averageAQI);
};

const generateHotspotsForState = async (
  state: string,
  baseLat: number,
  baseLng: number
): Promise<PollutionHotspot[]> => {
  const numHotspots = Math.floor(Math.random() * 3) + 1;
  const hotspots: PollutionHotspot[] = [];

  for (let i = 0; i < numHotspots; i++) {
    const latOffset = (Math.random() - 0.5) * 2;
    const lngOffset = (Math.random() - 0.5) * 2;
    
    const aqi = await fetchAQIData(baseLat + latOffset, baseLng + lngOffset);
    const wqi = await fetchWQIData(baseLat + latOffset, baseLng + lngOffset);

    const severity = aqi.aqi > 200 ? "Emergency" : aqi.aqi > 150 ? "Critical" : "High";

    hotspots.push({
      id: `${state}-${i + 1}`,
      location: `${state} Industrial Zone ${i + 1}`,
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset,
      aqi: aqi.aqi,
      wqi: wqi.wqi,
      severity,
      description: generateHotspotDescription(severity),
      recommendations: generateRecommendations(severity)
    });
  }

  return hotspots;
};

const generateHotspotDescription = (severity: string): string => {
  switch (severity) {
    case "Emergency":
      return "Critical pollution levels detected. Immediate action required.";
    case "Critical":
      return "High pollution concentration affecting air and water quality.";
    default:
      return "Elevated pollution levels requiring monitoring.";
  }
};

const generateRecommendations = (severity: string): string[] => {
  const baseRecommendations = [
    "Use air purifiers indoors",
    "Monitor air quality regularly"
  ];

  switch (severity) {
    case "Emergency":
      return [
        "Avoid all outdoor activities",
        "Wear N95 masks if outdoors",
        "Keep windows closed",
        ...baseRecommendations
      ];
    case "Critical":
      return [
        "Limit outdoor exposure",
        "Use protective masks",
        ...baseRecommendations
      ];
    default:
      return [
        "Consider reducing outdoor activities",
        ...baseRecommendations
      ];
  }
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
  if (aqi <= 50) return "Air quality is satisfactory. Enjoy outdoor activities!";
  if (aqi <= 100) return "Air quality is acceptable. Consider reducing prolonged outdoor activities if you're sensitive to pollution.";
  if (aqi <= 150) return "Children, elderly, and individuals with respiratory diseases should limit outdoor exertion.";
  if (aqi <= 200) return "Everyone may begin to experience health effects. Limit outdoor activities.";
  if (aqi <= 300) return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
  return "EMERGENCY: Everyone should avoid all outdoor physical activities and stay indoors.";
};

export const getWQIHealthMessage = (wqi: number): string => {
  if (wqi <= 50) return "Water quality is excellent. Safe for drinking and recreational activities.";
  if (wqi <= 100) return "Water quality is good. Generally safe, but minor treatment recommended.";
  if (wqi <= 150) return "Water requires treatment before drinking. OK for most recreational activities.";
  if (wqi <= 200) return "Water requires significant treatment. Limit direct contact.";
  if (wqi <= 300) return "Water is highly polluted. Avoid contact and do not consume without extensive treatment.";
  return "Water is severely contaminated. Not suitable for any use without intensive treatment.";
};
