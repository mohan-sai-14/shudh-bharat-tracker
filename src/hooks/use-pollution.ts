import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface City {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  aqi?: number;
  wqi?: number;
}

export interface PollutionData {
  aqi: {
    aqi: number;
    category: string;
  };
  wqi: {
    wqi: number;
    category: string;
  };
}

export function usePollution() {
  const [cities, setCities] = useState<City[]>([
    { id: '1', name: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090, aqi: 150, wqi: 75 },
    { id: '2', name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, aqi: 110, wqi: 90 },
    { id: '3', name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946, aqi: 120, wqi: 85 },
    { id: '4', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, aqi: 130, wqi: 80 },
    { id: '5', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, aqi: 100, wqi: 95 }
  ]);

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedCity) {
      setIsLoading(true);
      // Simulated API call to fetch pollution data
      const fetchData = async () => {
        try {
          // In a real app, this would be an API call
          const data: PollutionData = {
            aqi: {
              aqi: selectedCity.aqi || 0,
              category: getAQICategory(selectedCity.aqi || 0)
            },
            wqi: {
              wqi: selectedCity.wqi || 0,
              category: getWQICategory(selectedCity.wqi || 0)
            }
          };
          setPollutionData(data);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch pollution data',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedCity, toast]);

  return {
    cities,
    selectedCity,
    setSelectedCity,
    pollutionData,
    isLoading
  };
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getWQICategory(wqi: number): string {
  if (wqi <= 50) return 'Excellent';
  if (wqi <= 100) return 'Good';
  if (wqi <= 200) return 'Fair';
  if (wqi <= 300) return 'Poor';
  return 'Very Poor';
}
