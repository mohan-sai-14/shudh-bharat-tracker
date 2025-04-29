import { AQIData, WQIData, PollutionHotspot, StatePollutionData } from '@/types';

// Simulate API calls with random data for now
export const fetchAQIData = async (city: string): Promise<AQIData> => {
  try {
    // In a real implementation, we would use the city name to fetch data from a real API
    return {
      aqi: Math.floor(Math.random() * 300) + 50,
      components: {
        pm2_5: Math.random() * 100,
        pm10: Math.random() * 150,
        no2: Math.random() * 100,
        so2: Math.random() * 50,
        co: Math.random() * 10,
        o3: Math.random() * 100
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw new Error('Failed to fetch AQI data');
  }
};

export const fetchWQIData = async (city: string): Promise<WQIData> => {
  try {
    // In a real implementation, we would use the city name to fetch data from a real API
    return {
      wqi: Math.floor(Math.random() * 300) + 50,
      components: {
        ph: 6 + Math.random() * 3,
        dissolved_oxygen: Math.random() * 10,
        turbidity: Math.random() * 100,
        conductivity: Math.random() * 1000,
        temperature: 20 + Math.random() * 10
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching WQI data:', error);
    throw new Error('Failed to fetch WQI data');
  }
};

export const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return { category: 'Good', color: 'green' };
  if (aqi <= 100) return { category: 'Moderate', color: 'yellow' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: 'orange' };
  if (aqi <= 200) return { category: 'Unhealthy', color: 'red' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: 'purple' };
  return { category: 'Hazardous', color: 'maroon' };
};

export const getWQICategory = (wqi: number) => {
  if (wqi <= 50) return { category: 'Excellent', color: 'green' };
  if (wqi <= 100) return { category: 'Good', color: 'lime' };
  if (wqi <= 150) return { category: 'Fair', color: 'yellow' };
  if (wqi <= 200) return { category: 'Poor', color: 'orange' };
  if (wqi <= 300) return { category: 'Very Poor', color: 'red' };
  return { category: 'Hazardous', color: 'maroon' };
};

export const getAQIHealthMessage = (aqi: number): string => {
  const { category } = getAQICategory(aqi);
  switch (category) {
    case 'Good': return 'Air quality is satisfactory, and air pollution poses little or no risk.';
    case 'Moderate': return 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.';
    case 'Unhealthy for Sensitive Groups': return 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.';
    case 'Unhealthy': return 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.';
    case 'Very Unhealthy': return 'Health alert: The risk of health effects is increased for everyone.';
    case 'Hazardous': return 'Health warning of emergency conditions: everyone is more likely to be affected.';
    default: return 'Air quality data is currently unavailable.';
  }
};

export const getWQIHealthMessage = (wqi: number): string => {
  const { category } = getWQICategory(wqi);
  switch (category) {
    case 'Excellent': return 'Water quality is excellent. Safe for all uses.';
    case 'Good': return 'Water quality is good. Safe for most uses.';
    case 'Fair': return 'Water quality is acceptable. Some treatment may be needed for drinking.';
    case 'Poor': return 'Water quality is poor. Treatment required before use.';
    case 'Very Poor': return 'Water quality is very poor. Significant treatment required.';
    case 'Hazardous': return 'Water is unsafe for any use without extensive treatment.';
    default: return 'Water quality data is currently unavailable.';
  }
};

export const getCityCoordinates = async (city: string): Promise<{lat: number, lng: number}> => {
  try {
    // For now, just return dummy coordinates since we're not using a real API
    return { lat: 20.5937, lng: 78.9629 };
  } catch (err) {
    const error = err as Error;
    console.error('Error getting city coordinates:', error);
    throw new Error(`Failed to get coordinates: ${error.message}`);
  }
};

interface AQIComponents {
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

const calculateAQI = (concentration: number, pollutant: 'pm2_5' | 'pm10'): number => {
  const breakpoints = {
    pm2_5: [
      { min: 0, max: 12, aqiMin: 0, aqiMax: 50 },
      { min: 12.1, max: 35.4, aqiMin: 51, aqiMax: 100 },
      { min: 35.5, max: 55.4, aqiMin: 101, aqiMax: 150 },
      { min: 55.5, max: 150.4, aqiMin: 151, aqiMax: 200 },
      { min: 150.5, max: 250.4, aqiMin: 201, aqiMax: 300 },
      { min: 250.5, max: 500, aqiMin: 301, aqiMax: 500 }
    ],
    pm10: [
      { min: 0, max: 54, aqiMin: 0, aqiMax: 50 },
      { min: 55, max: 154, aqiMin: 51, aqiMax: 100 },
      { min: 155, max: 254, aqiMin: 101, aqiMax: 150 },
      { min: 255, max: 354, aqiMin: 151, aqiMax: 200 },
      { min: 355, max: 424, aqiMin: 201, aqiMax: 300 },
      { min: 425, max: 604, aqiMin: 301, aqiMax: 500 }
    ]
  };

  const bp = breakpoints[pollutant].find(
    bp => concentration >= bp.min && concentration <= bp.max
  ) || breakpoints[pollutant][breakpoints[pollutant].length - 1];

  return Math.round(
    ((bp.aqiMax - bp.aqiMin) / (bp.max - bp.min)) * 
    (concentration - bp.min) + 
    bp.aqiMin
  );
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
    { name: "Bihar", lat: 25.5941, lng: 85.1376 }
  ];

  const stateData: StatePollutionData[] = await Promise.all(
    allStates.map(async (state) => {
      const aqi = await fetchAQIData(state.name);
      const wqi = await fetchWQIData(state.name);

      const hotspots = await generateHotspotsForState(state.name, state.lat, state.lng);

      return {
        state: state.name,
        averageAQI: aqi.aqi,
        averageWQI: wqi.wqi,
        hotspots,
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

    const aqi = await fetchAQIData(state);
    const wqi = await fetchWQIData(state);

    const severity = aqi.aqi > 200 ? "Emergency" : aqi.aqi > 150 ? "Critical" : "High";

    hotspots.push({
      id: `${state}-${i + 1}`,
      location: `${state} Industrial Zone ${i + 1}`,
      lat: baseLat + latOffset,
      lng: baseLng + lngOffset,
      aqi: aqi.aqi,
      wqi: wqi.wqi,
      severity,
      description: await generateHotspotDescription(severity),
      recommendations: generateRecommendations(severity)
    });
  }

  return hotspots;
};

const generateHotspotDescription = async (severity: string): Promise<string> => {
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