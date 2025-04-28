
import { usePollution } from "@/contexts/PollutionContext";
import { AQICard } from "@/components/pollution/AQICard";
import { WQICard } from "@/components/pollution/WQICard";
import { CitySelector } from "@/components/pollution/CitySelector";
import { PollutionAlert } from "@/components/pollution/PollutionAlert";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Camera, ChartLine, MapPin, RefreshCw } from "lucide-react";
import { EcoChallenge } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Simulated eco challenges for the dashboard
  const featuredChallenges: EcoChallenge[] = [
    {
      id: "1",
      title: "Plant 5 Trees",
      description: "Help increase green cover by planting trees in your neighborhood.",
      points: 500,
      participants: 1245,
      difficulty: "Medium",
      duration: "30 days",
      startDate: "2025-04-15",
      endDate: "2025-05-15",
      type: "Individual",
      isActive: true,
      completedBy: []
    },
    {
      id: "2",
      title: "Zero Plastic Week",
      description: "Eliminate all single-use plastics from your daily routine.",
      points: 300,
      participants: 857,
      difficulty: "Hard",
      duration: "7 days",
      startDate: "2025-04-20",
      endDate: "2025-04-27",
      type: "Individual",
      isActive: true,
      completedBy: []
    }
  ];
  
  const handleRefresh = async () => {
    if (!selectedCity) return;
    
    setIsRefreshing(true);
    await fetchPollutionData(selectedCity.name);
    setIsRefreshing(false);
    
    toast({
      title: "Data Refreshed",
      description: `Latest pollution data for ${selectedCity.name} has been loaded.`,
      duration: 3000,
    });
  };
  
  const handleCityChange = async (city: typeof cities[0]) => {
    setSelectedCity(city);
    await fetchPollutionData(city.name);
  };
  
  const handleChallengeAccept = (challenge: EcoChallenge) => {
    toast({
      title: "Challenge Accepted!",
      description: `You've accepted the "${challenge.title}" challenge. Good luck!`,
      duration: 3000,
    });
  };
  
  const handleChallengeComplete = (challenge: EcoChallenge) => {
    toast({
      title: "Challenge Completed!",
      description: `Congratulations! You've earned ${challenge.points} eco-points.`,
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-eco-dark-green">
            Bharat Shudh Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time pollution tracking and eco-challenges
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <CitySelector 
            cities={cities}
            selectedCity={selectedCity}
            onSelect={handleCityChange}
          />
          <Button 
            size="icon" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
      
      {pollutionData?.aqi && pollutionData.aqi.aqi > 150 && (
        <PollutionAlert aqi={pollutionData.aqi.aqi} />
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || !pollutionData ? (
          <>
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
          </>
        ) : (
          <>
            <AQICard 
              data={pollutionData.aqi} 
              city={pollutionData.city}
            />
            <WQICard 
              data={pollutionData.wqi} 
              city={pollutionData.city}
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
                    <ChartLine className="mr-2 h-4 w-4" />
                    View Pollution Trends
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-eco-dark-green mt-12">
        Pollution Level Guidelines
      </h2>
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
                <Badge variant="outline" className="bg-green-500 text-white">Safe</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-lime-100 rounded">
                <span>Good (51-100)</span>
                <Badge variant="outline" className="bg-lime-500 text-white">Safe</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                <span>Fair (101-150)</span>
                <Badge variant="outline" className="bg-yellow-500">Moderate</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-100 rounded">
                <span>Poor (151-200)</span>
                <Badge variant="outline" className="bg-orange-500">Poor</Badge>
              </div>
                <span>Marginal (25-50)</span>
                <Badge className="bg-orange-500">Poor</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                <span>Poor (0-25)</span>
                <Badge className="bg-red-500">Unsafe</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
