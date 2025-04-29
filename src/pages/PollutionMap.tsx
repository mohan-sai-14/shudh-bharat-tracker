import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { usePollution, type City } from "@/hooks/use-pollution";

interface Location {
  lat: number;
  lon: number;
}

interface PollutionMarker {
  id: string;
  location: Location;
  aqi: number;
  wqi: number;
}

const PollutionMap = () => {
  const { pollutionData, isLoading, selectedCity, cities, setSelectedCity } = usePollution();
  const [activeTab, setActiveTab] = useState<"aqi" | "wqi">("aqi");
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getMarkerColor = (value: number): string => {
    if (value <= 50) return "#00e400"; // Good
    if (value <= 100) return "#ffff00"; // Moderate
    if (value <= 150) return "#ff7e00"; // Unhealthy for Sensitive Groups
    if (value <= 200) return "#ff0000"; // Unhealthy
    if (value <= 300) return "#8f3f97"; // Very Unhealthy
    return "#7e0023"; // Hazardous
  };

  const handleCitySelect = (cityId: string) => {
    const city = cities.find((c: City) => c.id === cityId);
    setSelectedCity(city || null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "aqi" | "wqi")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="aqi">Air Quality Index</TabsTrigger>
            <TabsTrigger value="wqi">Water Quality Index</TabsTrigger>
          </TabsList>

          <TabsContent value="aqi" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cities.map((city: City) => (
                <Card
                  key={city.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCity?.id === city.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleCitySelect(city.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">{city.state}</p>
                    </div>
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: getMarkerColor(city.aqi || 0),
                        color: city.aqi && city.aqi > 100 ? "white" : "black",
                      }}
                    >
                      AQI: {city.aqi || "N/A"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wqi" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cities.map((city: City) => (
                <Card
                  key={city.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCity?.id === city.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleCitySelect(city.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">{city.state}</p>
                    </div>
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: getMarkerColor(city.wqi || 0),
                        color: city.wqi && city.wqi > 100 ? "white" : "black",
                      }}
                    >
                      WQI: {city.wqi || "N/A"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PollutionMap;