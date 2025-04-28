
import { useEffect, useRef, useState } from "react";
import { usePollution } from "@/contexts/PollutionContext";
import { CitySelector } from "@/components/pollution/CitySelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAQICategory, getWQICategory } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoIcon, Layers, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const PollutionMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { pollutionData, isLoading, selectedCity, cities, setSelectedCity } = usePollution();
  const [activeTab, setActiveTab] = useState<"aqi" | "wqi">("aqi");

  // This is a placeholder for map implementation
  // In a real project, we would integrate LeafletJS here
  useEffect(() => {
    if (!mapRef.current || !selectedCity) return;
    
    // Initialize the map (this is where we would use Leaflet in a real implementation)
    console.log("Initializing map centered at", selectedCity.lat, selectedCity.lng);
    
    // This is where we would render the pollution data on the map
    if (pollutionData) {
      console.log("Rendering pollution data on map:", pollutionData);
    }
    
    // Cleanup function
    return () => {
      console.log("Cleaning up map");
    };
  }, [selectedCity, pollutionData, activeTab]);
  
  const renderGradientLegend = () => {
    const legendItems = [
      { level: "Good", color: "#4CAF50", range: "0-50" },
      { level: "Moderate", color: "#FFEB3B", range: "51-100" },
      { level: "Unhealthy for Sensitive", color: "#FF9800", range: "101-150" },
      { level: "Unhealthy", color: "#F44336", range: "151-200" },
      { level: "Very Unhealthy", color: "#9C27B0", range: "201-300" },
      { level: "Hazardous", color: "#7D1919", range: "301+" },
    ];
    
    return (
      <div className="flex flex-col gap-1 mt-4">
        <h3 className="text-sm font-medium">Legend</h3>
        <div className="flex w-full">
          {legendItems.map((item, index) => (
            <div 
              key={index} 
              className="flex-1 h-3 first:rounded-l-sm last:rounded-r-sm"
              style={{ backgroundColor: item.color }}
            />
          ))}
        </div>
        <div className="flex w-full justify-between text-xs text-gray-500">
          {legendItems.map((item, index) => (
            <div key={index} className="w-6 text-center">
              {index === 0 ? "0" : item.range.split("-")[0]}
            </div>
          ))}
          <div className="w-6 text-center">300+</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-eco-dark-green">
            Pollution Map
          </h1>
          <p className="text-muted-foreground">
            Interactive map showing pollution levels across India
          </p>
        </div>
        
        <CitySelector 
          cities={cities}
          selectedCity={selectedCity}
          onSelect={setSelectedCity}
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <Tabs
                defaultValue="aqi"
                className="w-auto"
                onValueChange={(value) => setActiveTab(value as "aqi" | "wqi")}
              >
                <TabsList>
                  <TabsTrigger value="aqi">Air Quality</TabsTrigger>
                  <TabsTrigger value="wqi">Water Quality</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-[60vh] bg-slate-100 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <>
                  {/* This is a placeholder for the map */}
                  <div 
                    ref={mapRef} 
                    className="h-full w-full bg-[url('/map-placeholder.svg')] bg-cover bg-center relative"
                  >
                    {/* This is a placeholder for the pollution overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-eco-green opacity-30" />
                    
                    {/* Center marker */}
                    {selectedCity && (
                      <div 
                        className="absolute rounded-full" 
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "20px",
                          height: "20px",
                          backgroundColor: activeTab === "aqi" 
                            ? getAQICategory(pollutionData?.aqi?.aqi || 0).color
                            : getWQICategory(pollutionData?.wqi?.wqi || 0).color,
                          boxShadow: "0 0 0 4px rgba(255,255,255,0.5)"
                        }}
                      />
                    )}
                    
                    {/* Map info overlay */}
                    <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md text-sm">
                      <p className="font-medium">
                        Viewing: {activeTab === "aqi" ? "Air Quality" : "Water Quality"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {selectedCity?.name || "No city selected"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Search Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search for a location..."
                  className="pl-9"
                />
              </div>
              
              <div className="space-y-2 mt-2">
                <p className="text-sm font-medium">Popular Locations</p>
                {cities.slice(0, 5).map(city => (
                  <Button 
                    key={city.name} 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setSelectedCity(city)}
                  >
                    {city.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pollution Levels</CardTitle>
            </CardHeader>
            <CardContent>
              {renderGradientLegend()}
              
              <div className="mt-6 space-y-3 text-sm">
                <p className="font-medium">
                  {activeTab === "aqi" ? "Air Quality Categories" : "Water Quality Categories"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-eco-green" />
                  <span>Good (0-50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFEB3B]" />
                  <span>Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF9800]" />
                  <span>Unhealthy for Sensitive Groups (101-150)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F44336]" />
                  <span>Unhealthy (151-200)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9C27B0]" />
                  <span>Very Unhealthy (201-300)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#7D1919]" />
                  <span>Hazardous (301+)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PollutionMap;
