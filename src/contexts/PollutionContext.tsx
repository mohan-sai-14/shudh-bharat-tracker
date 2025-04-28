
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { City, PollutionData } from '@/types';
import { fetchAQIData, fetchWQIData, getCityCoordinates } from '@/lib/api';

interface PollutionContextType {
  userLocation: {
    city: string;
    lat: number;
    lng: number;
  } | null;
  selectedCity: City | null;
  pollutionData: PollutionData | null;
  isLoading: boolean;
  error: string | null;
  fetchPollutionData: (city: string) => Promise<void>;
  setSelectedCity: (city: City | null) => void;
  updateUserLocation: (city: string, lat: number, lng: number) => void;
  cities: City[];
}

const PollutionContext = createContext<PollutionContextType | undefined>(undefined);

export const PollutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ city: string; lat: number; lng: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Popular Indian cities with coordinates
  const cities: City[] = [
    // Northern India
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Noida", lat: 28.5355, lng: 77.3910 },
    { name: "Gurugram", lat: 28.4595, lng: 77.0266 },
    { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
    { name: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
    { name: "Agra", lat: 27.1767, lng: 78.0081 },
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
    { name: "Aligarh", lat: 27.8974, lng: 78.0880 },
    { name: "Meerut", lat: 28.9845, lng: 77.7064 },
    { name: "Ambala", lat: 30.3752, lng: 76.7821 },
    { name: "Patiala", lat: 30.3398, lng: 76.3869 },
    { name: "Jammu", lat: 32.7266, lng: 74.8570 },
    { name: "Shimla", lat: 31.1048, lng: 77.1734 },
    
    // Western India
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { name: "Nashik", lat: 19.9975, lng: 73.7898 },
    { name: "Aurangabad", lat: 19.8762, lng: 75.3433 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Surat", lat: 21.1702, lng: 72.8311 },
    { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
    { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
    { name: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
    { name: "Indore", lat: 22.7196, lng: 75.8577 },
    { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { name: "Ujjain", lat: 23.1765, lng: 75.7885 },
    { name: "Chandrapur", lat: 19.9615, lng: 79.2961 },
    { name: "Kolhapur", lat: 16.7050, lng: 74.2433 },
    
    // Southern India
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
    { name: "Madurai", lat: 9.9252, lng: 78.1198 },
    { name: "Vijayawada", lat: 16.5062, lng: 80.6480 },
    { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
    { name: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
    { name: "Mysuru", lat: 12.2958, lng: 76.6394 },
    { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
    { name: "Kochi", lat: 9.9312, lng: 76.2673 },
    { name: "Chittoor", lat: 13.2172, lng: 79.1003 },
    
    // Eastern India
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Howrah", lat: 22.5958, lng: 88.2636 },
    { name: "Durgapur", lat: 23.5204, lng: 87.3119 },
    { name: "Jamshedpur", lat: 22.8046, lng: 86.2029 },
    { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
    { name: "Ranchi", lat: 23.3441, lng: 85.3096 },
    { name: "Bokaro", lat: 23.6693, lng: 86.1511 },
    { name: "Patna", lat: 25.5941, lng: 85.1376 },
    { name: "Raipur", lat: 21.2514, lng: 81.6296 },
    { name: "Asansol", lat: 23.6739, lng: 86.9524 },
    
    // Northeastern India
    { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
    { name: "Shillong", lat: 25.5788, lng: 91.8933 },
    { name: "Imphal", lat: 24.8170, lng: 93.9368 },
    { name: "Agartala", lat: 23.8315, lng: 91.2868 },
    { name: "Dimapur", lat: 25.9091, lng: 93.7272 },
    
    // Other Notable Cities
    { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
    { name: "Dehradun", lat: 30.3165, lng: 78.0322 },
    { name: "Haridwar", lat: 29.9457, lng: 78.1642 },
    { name: "Rishikesh", lat: 30.0869, lng: 78.2676 },
    { name: "Pondicherry", lat: 11.9416, lng: 79.8083 },
    { name: "Srinagar", lat: 34.0837, lng: 74.7973 },
    { name: "Jodhpur", lat: 26.2389, lng: 73.0243 },
    { name: "Ajmer", lat: 26.4499, lng: 74.6399 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 }
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Find closest city from our predefined list
            let closestCity = cities[0];
            let minDistance = calculateDistance(
              latitude, longitude,
              cities[0].lat, cities[0].lng
            );
            
            cities.forEach(city => {
              const distance = calculateDistance(
                latitude, longitude,
                city.lat, city.lng
              );
              if (distance < minDistance) {
                minDistance = distance;
                closestCity = city;
              }
            });
            
            updateUserLocation(closestCity.name, closestCity.lat, closestCity.lng);
            setSelectedCity(closestCity);
            await fetchPollutionData(closestCity.name);
            
            // Store in localStorage for offline use
            localStorage.setItem('userLocation', JSON.stringify({
              city: closestCity.name,
              lat: closestCity.lat,
              lng: closestCity.lng
            }));
          } catch (err) {
            console.error("Error getting location:", err);
            // Default to Delhi if geolocation fails
            const defaultCity = cities[0];
            updateUserLocation(defaultCity.name, defaultCity.lat, defaultCity.lng);
            setSelectedCity(defaultCity);
            await fetchPollutionData(defaultCity.name);
          }
        },
        async (err) => {
          console.error("Geolocation error:", err);
          // Default to Delhi if geolocation is denied
          const defaultCity = cities[0];
          updateUserLocation(defaultCity.name, defaultCity.lat, defaultCity.lng);
          setSelectedCity(defaultCity);
          await fetchPollutionData(defaultCity.name);
        }
      );
    } else {
      // Geolocation not supported
      toast({
        title: "Location Not Available",
        description: "Your browser doesn't support geolocation. Showing default data.",
        variant: "destructive"
      });
      // Default to Delhi
      const defaultCity = cities[0];
      updateUserLocation(defaultCity.name, defaultCity.lat, defaultCity.lng);
      setSelectedCity(defaultCity);
      fetchPollutionData(defaultCity.name);
    }
    
    // Try to load cached data first for immediate display
    const cachedData = localStorage.getItem('pollutionData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (parsedData.timestamp && new Date().getTime() - parsedData.timestamp < 3600000) {
        // Use cached data if less than 1 hour old
        setPollutionData(parsedData.data);
      }
    }
  }, []);
  
  const fetchPollutionData = async (city: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let coords;
      const foundCity = cities.find(c => c.name.toLowerCase() === city.toLowerCase());
      
      if (foundCity) {
        coords = { lat: foundCity.lat, lng: foundCity.lng };
      } else {
        coords = await getCityCoordinates(city);
      }
      
      // Fetch AQI data
      const aqiData = await fetchAQIData(coords.lat, coords.lng);
      
      // Fetch WQI data (simulated)
      const wqiData = await fetchWQIData(coords.lat, coords.lng);
      
      const data = {
        aqi: aqiData,
        wqi: wqiData,
        city,
        timestamp: new Date().toISOString()
      };
      
      setPollutionData(data);
      
      // Cache the data for offline use
      localStorage.setItem('pollutionData', JSON.stringify({
        data,
        timestamp: new Date().getTime()
      }));
      
      setIsLoading(false);
      
      // Show alert for high pollution levels
      if (aqiData.aqi > 150) {
        toast({
          title: "⚠️ High Pollution Alert",
          description: `${city} currently has unhealthy air quality (AQI: ${aqiData.aqi}). Take precautions.`,
          variant: "destructive",
          duration: 6000,
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError(`Failed to fetch pollution data: ${err}`);
      toast({
        title: "Error Fetching Data",
        description: `Could not load pollution data for ${city}. Please try again.`,
        variant: "destructive"
      });
      
      // Try to use cached data if available
      const cachedData = localStorage.getItem('pollutionData');
      if (cachedData) {
        setPollutionData(JSON.parse(cachedData).data);
      }
    }
  };
  
  const updateUserLocation = (city: string, lat: number, lng: number) => {
    setUserLocation({ city, lat, lng });
  };
  
  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  return (
    <PollutionContext.Provider value={{
      userLocation,
      selectedCity,
      pollutionData,
      isLoading,
      error,
      fetchPollutionData,
      setSelectedCity,
      updateUserLocation,
      cities
    }}>
      {children}
    </PollutionContext.Provider>
  );
};

export const usePollution = (): PollutionContextType => {
  const context = useContext(PollutionContext);
  if (context === undefined) {
    throw new Error('usePollution must be used within a PollutionProvider');
  }
  return context;
};
