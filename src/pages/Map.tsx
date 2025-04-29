import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PollutionMap } from "@/components/pollution/PollutionMap";
import { usePollution } from "@/contexts/PollutionContext";

export default function Map() {
  const { pollutionData, cities, fetchPollutionData } = usePollution();

  // Fetch data for all cities when the map loads
  useEffect(() => {
    const fetchAllCitiesData = async () => {
      await Promise.all(cities.map(city => fetchPollutionData(city.name)));
    };
    fetchAllCitiesData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pollution Map</h1>
        <p className="text-muted-foreground">View pollution levels across cities in India</p>
      </div>

      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          <PollutionMap 
            pollutionData={cities.map(city => ({
              city: city.name,
              coordinates: [city.lat, city.lng] as [number, number],
              aqi: pollutionData?.[city.name]?.aqi || {
                aqi: 0,
                components: {
                  pm2_5: 0,
                  pm10: 0,
                  no2: 0,
                  so2: 0,
                  co: 0,
                  o3: 0
                },
                timestamp: new Date().toISOString()
              }
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
