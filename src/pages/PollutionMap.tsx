import { useEffect, useRef, useState } from "react";
import { usePollution } from "@/contexts/PollutionContext";
import { CitySelector } from "@/components/pollution/CitySelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAQICategory, getWQICategory, fetchAQIData, fetchWQIData } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleDot, Filter, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import IndiaMap from "@/components/pollution/IndiaMap";
import { City } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const PollutionMap = () => {
  const { pollutionData, isLoading, selectedCity, cities, setSelectedCity } = usePollution();
  const [activeTab, setActiveTab] = useState<"aqi" | "wqi">("aqi");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLocations, setMapLocations] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<City[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initialLocations = cities.map(city => ({
      ...city,
      isMain: true
    }));
    
    const smallerLocations = [
      { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
      { name: "Agra", lat: 27.1767, lng: 78.0081 },
      { name: "Kochi", lat: 9.9312, lng: 76.2673 },
      { name: "Amritsar", lat: 31.6340, lng: 74.8723 },
      { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
      { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
      { name: "Indore", lat: 22.7196, lng: 75.8577 },
      { name: "Patna", lat: 25.5941, lng: 85.1376 },
      { name: "Surat", lat: 21.1702, lng: 72.8311 },
      { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },
      { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
      { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
      { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
      { name: "Kanpur", lat: 26.4499, lng: 80.3319 },
      { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
      { name: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
      { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
      { name: "Shimla", lat: 31.1048, lng: 77.1734 },
      { name: "Rishikesh", lat: 30.0869, lng: 78.2676 },
      { name: "Darjeeling", lat: 27.0410, lng: 88.2663 },
      { name: "Dehradun", lat: 30.3165, lng: 78.0322 }
    ];
    
    const allLocations = [...initialLocations, ...smallerLocations.map(loc => ({ ...loc, isMain: false }))];
    
    const fetchAllData = async () => {
      const locationsWithData = await Promise.all(
        allLocations.map(async (location) => {
          try {
            const aqi = await fetchAQIData(location.lat, location.lng);
            const wqi = await fetchWQIData(location.lat, location.lng);
            
            const aqiCategory = getAQICategory(aqi.aqi);
            const wqiCategory = getWQICategory(wqi.wqi);
            
            return {
              ...location,
              aqi: aqi.aqi,
              wqi: wqi.wqi,
              aqiColor: aqiCategory.color,
              wqiColor: wqiCategory.color,
              aqiCategory: aqiCategory.category,
              wqiCategory: wqiCategory.category
            };
          } catch {
            return location;
          }
        })
      );
      
      setMapLocations(locationsWithData);
      
      const allCities = [
        ...cities,
        ...smallerLocations.map(loc => ({ 
          name: loc.name, 
          lat: loc.lat, 
          lng: loc.lng 
        }))
      ];
      
      setFilteredLocations(allCities);
    };
    
    fetchAllData();
  }, [cities]);
  
  useEffect(() => {
    if (!searchQuery) {
      setFilteredLocations([...cities, ...(mapLocations.filter(loc => !loc.isMain).map(loc => ({ 
        name: loc.name, 
        lat: loc.lat, 
        lng: loc.lng 
      })))]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = mapLocations
      .filter(location => location.name.toLowerCase().includes(query))
      .map(loc => ({ name: loc.name, lat: loc.lat, lng: loc.lng }));
    
    setFilteredLocations(filtered);
  }, [searchQuery, mapLocations, cities]);
  
  const handleLocationSelect = (city: City) => {
    setSelectedCity(city);
    toast({
      title: `Selected ${city.name}`,
      description: "Viewing pollution data for this location",
    });
  };

  const handleMarkerClick = (location: any) => {
    setSelectedCity({
      name: location.name,
      lat: location.lat,
      lng: location.lng
    });
  };

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
          cities={filteredLocations}
          selectedCity={selectedCity}
          onSelect={handleLocationSelect}
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
                  <Filter className="h-4 w-4 mr-2" />
                  Layers
                </Button>
                <div className="relative hidden sm:block w-40">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Filter map..."
                    className="pl-9 h-8 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="h-[60vh] bg-slate-100 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <IndiaMap
                  center={[78.9629, 20.5937]}
                  markers={mapLocations}
                  activeTab={activeTab}
                  onMarkerClick={handleMarkerClick}
                />
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 mt-2">
                <p className="text-sm font-medium">Popular Locations</p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredLocations.slice(0, 10).map(city => (
                    <Button 
                      key={city.name} 
                      variant="ghost" 
                      className="w-full justify-start h-8 text-sm"
                      onClick={() => handleLocationSelect(city)}
                    >
                      <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      {city.name}
                    </Button>
                  ))}
                  
                  {searchQuery && filteredLocations.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2 text-center">
                      No locations found matching "{searchQuery}"
                    </p>
                  )}
                </div>
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
