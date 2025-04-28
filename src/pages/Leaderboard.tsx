import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatePollutionData } from "@/types";
import { MapPin, AlertTriangle } from "lucide-react";

const Leaderboard = () => {
  const [stateData, setStateData] = useState<StatePollutionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API calls to CPCB/IQAir
    const fetchStateData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API integration
        const mockData: StatePollutionData[] = [
          {
            state: "Delhi",
            averageAQI: 165,
            averageWQI: 145,
            hotspots: [
              {
                id: "1",
                location: "Anand Vihar",
                lat: 28.6469,
                lng: 77.3161,
                aqi: 195,
                wqi: 155,
                severity: "Critical",
                description: "Industrial and traffic pollution hotspot",
                recommendations: ["Wear N95 masks", "Avoid outdoor activities"]
              }
            ],
            lastUpdated: new Date().toISOString()
          },
          // Add more states...
        ];
        setStateData(mockData);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
      setLoading(false);
    };

    fetchStateData();
  }, []);

  const getStatusColor = (value: number) => {
    if (value <= 50) return "text-green-600";
    if (value <= 100) return "text-yellow-600";
    if (value <= 150) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">
          State Pollution Rankings
        </h1>
        <p className="text-muted-foreground">
          Real-time pollution levels across Indian states
        </p>
      </div>

      <Tabs defaultValue="aqi">
        <TabsList>
          <TabsTrigger value="aqi">Air Quality (AQI)</TabsTrigger>
          <TabsTrigger value="wqi">Water Quality (WQI)</TabsTrigger>
        </TabsList>

        <TabsContent value="aqi" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AQI Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stateData
                  .sort((a, b) => a.averageAQI - b.averageAQI)
                  .map((state, index) => (
                    <div 
                      key={state.state} 
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        index === 0 ? "bg-green-50" : 
                        index === stateData.length - 1 ? "bg-red-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        <span className="text-lg font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{state.state}</span>
                          {state.hotspots.length > 0 && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {state.hotspots.length} Hotspots
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold ${getStatusColor(state.averageAQI)}`}>
                          {state.averageAQI}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated {new Date(state.lastUpdated).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wqi" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">WQI Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stateData
                  .sort((a, b) => a.averageWQI - b.averageWQI)
                  .map((state, index) => (
                    <div 
                      key={state.state} 
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        index === 0 ? "bg-green-50" : 
                        index === stateData.length - 1 ? "bg-red-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center w-8">
                        <span className="text-lg font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{state.state}</span>
                          {state.hotspots.length > 0 && (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {state.hotspots.length} Hotspots
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold ${getStatusColor(state.averageWQI)}`}>
                          {state.averageWQI}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Updated {new Date(state.lastUpdated).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;