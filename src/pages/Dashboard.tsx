import { usePollution } from "@/contexts/PollutionContext";
import { AQICard } from "@/components/pollution/AQICard";
import { WQICard } from "@/components/pollution/WQICard";
import { CitySelector } from "@/components/pollution/CitySelector";
import { PollutionAlert } from "@/components/pollution/PollutionAlert";
import { PollutionMap } from "@/components/pollution/PollutionMap";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { CommunityForum } from "@/components/community/CommunityForum";
import { EducationalContent } from "@/components/education/EducationalContent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MapPin, RefreshCw, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { realtimeService } from "@/services/realtime";
import { cn } from "@/lib/utils";
import { City } from "@/types";
import { useGeolocation } from "@/hooks/use-geolocation";
import { getAQIData, getWQIData, reverseGeocode } from "@/lib/api";
import { AQIData, WQIData } from "@/types";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { 
    pollutionData, 
    isLoading, 
    error, 
    fetchPollutionData, 
    cities, 
    selectedCity, 
    setSelectedCity 
  } = usePollution();

  const { latitude, longitude, error: locationError } = useGeolocation();
  const [city, setCity] = useState<string>("");
  const [aqiData, setAqiData] = useState<any>();
  const [wqiData, setWqiData] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      if (latitude && longitude) {
        try {
          const [cityName, aqi, wqi] = await Promise.all([
            reverseGeocode(latitude, longitude),
            getAQIData(latitude, longitude),
            getWQIData(latitude, longitude),
          ]);

          setCity(cityName);
          setAqiData(aqi);
          setWqiData(wqi);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [latitude, longitude]);

  useEffect(() => {
    if (activeTab === "map") {
      const fetchAllCitiesData = async () => {
        try {
          await Promise.all(cities.map(city => fetchPollutionData(city.name)));
        } catch (error) {
          console.error("Failed to fetch data for all cities:", error);
        }
      };
      fetchAllCitiesData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedCity) {
      realtimeService.subscribeToAQIUpdates(selectedCity.name, (data) => {
        fetchPollutionData(selectedCity.name);
      });
      
      return () => {
        realtimeService.unsubscribeFromAQIUpdates(selectedCity.name);
      };
    }
  }, [selectedCity]);

  const handleRefresh = async () => {
    if (!selectedCity) return;
    
    setIsRefreshing(true);
    try {
      await fetchPollutionData(selectedCity.name);
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  useEffect(() => {
    if (selectedCity) {
      fetchPollutionData(selectedCity.name);
    }
  }, [selectedCity]);

  const renderContent = () => {
    if (locationError) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Location Access Required
          </h2>
          <p className="text-center text-muted-foreground max-w-md">
            {locationError}
          </p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading pollution data...</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
      );
    }

    if (!selectedCity) {
      return (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Please select a city to view pollution data</p>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    const cityData = pollutionData?.[selectedCity.name];
    
    return (
      <>
        {cityData?.aqi?.aqi && cityData.aqi.aqi > 150 && (
          <PollutionAlert aqi={cityData.aqi.aqi} />
        )}

        {cityData?.aqi && cityData?.wqi && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AQICard 
              data={cityData.aqi} 
              city={selectedCity.name}
            />
            <WQICard 
              data={cityData.wqi} 
              city={selectedCity.name}
            />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" asChild>
                  <Link to="/report">
                    <Camera className="mr-2 h-4 w-4" />
                    Report Pollution
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/map">
                    <MapPin className="mr-2 h-4 w-4" />
                    View Pollution Map
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/trends">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    View Pollution Trends
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitor and track pollution levels in your city</p>
        </div>
        <div className="flex items-center gap-4">
          <CitySelector
            cities={cities}
            selectedCity={selectedCity}
            onSelect={handleCitySelect}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || !selectedCity}
          >
            <RefreshCw className={cn("h-4 w-4", { "animate-spin": isRefreshing })} />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderContent()}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Index (AQI) Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span>Good (0-50)</span>
                    <Badge className="bg-green-500">Safe</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                    <span>Moderate (51-100)</span>
                    <Badge className="bg-yellow-500">Acceptable</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-100 rounded">
                    <span>Unhealthy for Sensitive Groups (101-150)</span>
                    <Badge className="bg-orange-500">Caution</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                    <span>Unhealthy (151-200)</span>
                    <Badge className="bg-red-500">Harmful</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-100 rounded">
                    <span>Very Unhealthy (201-300)</span>
                    <Badge className="bg-purple-500">Very Harmful</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#7D1919]/20 rounded">
                    <span>Hazardous (301+)</span>
                    <Badge className="bg-[#7D1919]">Severe</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Water Quality Index (WQI) Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                    <span>Excellent (0-50)</span>
                    <Badge className="bg-green-500">Safe</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-lime-100 rounded">
                    <span>Good (51-100)</span>
                    <Badge className="bg-lime-500">Safe</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                    <span>Fair (101-150)</span>
                    <Badge className="bg-yellow-500">Moderate</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-100 rounded">
                    <span>Poor (151-200)</span>
                    <Badge className="bg-orange-500">Poor</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                    <span>Very Poor (201-300)</span>
                    <Badge className="bg-red-500">Very Poor</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-[#7D1919]/20 rounded">
                    <span>Hazardous (301+)</span>
                    <Badge className="bg-[#7D1919]">Hazardous</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <Card className="h-[500px]">
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
        </TabsContent>

        <TabsContent value="community">
          <CommunityForum />
        </TabsContent>

        <TabsContent value="learn">
          <EducationalContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;