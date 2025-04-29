import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { City, PollutionData } from '@/types';
import { fetchAQIData, fetchWQIData } from '@/lib/api';
import { realtimeService } from '@/services/realtime';

interface PollutionContextType {
  userLocation: {
    city: string;
    lat: number;
    lng: number;
  } | null;
  selectedCity: City | null;
  pollutionData: Record<string, PollutionData> | null;
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
  const [selectedCity, _setSelectedCity] = useState<City | null>(null);
  const [pollutionData, setPollutionData] = useState<Record<string, PollutionData> | null>(null);
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
    { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
    
    // Western India
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Pune", lat: 18.5204, lng: 73.8567 },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { name: "Surat", lat: 21.1702, lng: 72.8311 },
    
    // Southern India
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    { name: "Kochi", lat: 9.9312, lng: 76.2673 },
    
    // Eastern India
    { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { name: "Patna", lat: 25.5941, lng: 85.1376 },
    { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
    { name: "Guwahati", lat: 26.1445, lng: 91.7362 }
  ];

  const fetchPollutionData = async (city: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [aqiData, wqiData] = await Promise.all([
        fetchAQIData(city),
        fetchWQIData(city)
      ]);

      setPollutionData(prev => ({
        ...prev,
        [city]: {
          city,
          aqi: aqiData,
          wqi: wqiData,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (err) {
      const error = err as Error;
      console.error("Failed to fetch pollution data:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to fetch pollution data: ${error.message}`,
        variant: "destructive"
      });
      throw error; // Re-throw to handle in components
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedCity = (city: City | null) => {
    _setSelectedCity(city);
    if (city) {
      fetchPollutionData(city.name).catch(error => {
        console.error("Failed to fetch data for selected city:", error);
      });
    }
  };

  const updateUserLocation = (city: string, lat: number, lng: number) => {
    setUserLocation({ city, lat, lng });
    const cityObj = cities.find(c => c.name === city);
    if (cityObj) {
      setSelectedCity(cityObj);
      fetchPollutionData(city).catch(error => {
        console.error("Failed to fetch data for new location:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data for the new location",
          variant: "destructive"
        });
      });
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchPollutionData(selectedCity.name).catch(error => {
        console.error("Failed to fetch data for selected city:", error);
      });
    }
  }, [selectedCity?.name]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const nearestCity = cities.find(city => 
              Math.abs(city.lat - latitude) < 1 && 
              Math.abs(city.lng - longitude) < 1
            );
            
            if (nearestCity) {
              updateUserLocation(nearestCity.name, nearestCity.lat, nearestCity.lng);
            } else {
              toast({
                title: "Location Notice",
                description: "No supported cities found near your location. Please select a city manually.",
                variant: "default"
              });
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast({
              title: "Location Error",
              description: "Unable to get your location. Please select a city manually.",
              variant: "destructive"
            });
          }
        );
      }
    };

    getLocation();
  }, []);

  // Connect to realtime service when component mounts
  useEffect(() => {
    realtimeService.connect();
    return () => {
      realtimeService.disconnect();
    };
  }, []);

  const value = {
    userLocation,
    selectedCity,
    pollutionData,
    isLoading,
    error,
    fetchPollutionData,
    setSelectedCity,
    updateUserLocation,
    cities
  };

  return (
    <PollutionContext.Provider value={value}>
      {children}
    </PollutionContext.Provider>
  );
};

export const usePollution = () => {
  const context = useContext(PollutionContext);
  if (context === undefined) {
    throw new Error('usePollution must be used within a PollutionProvider');
  }
  return context;
};
