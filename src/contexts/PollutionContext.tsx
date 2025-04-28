
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
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462 }
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
