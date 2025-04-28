
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatePollutionData } from "@/types";
import { MapPin, AlertTriangle } from "lucide-react";
import { fetchStatePollutionData } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const [stateData, setStateData] = useState<StatePollutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"aqi" | "wqi">("aqi");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchStatePollutionData();
        setStateData(data);
      } catch (err) {
        setError("Failed to load state pollution data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number) => {
    if (value <= 50) return "bg-green-100 text-green-800";
    if (value <= 100) return "bg-yellow-100 text-yellow-800";
    if (value <= 150) return "bg-orange-100 text-orange-800";
    if (value <= 200) return "bg-red-100 text-red-800";
    if (value <= 300) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "aqi" | "wqi")}>
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
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {state.hotspots.length} Hotspots
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className={getStatusColor(state.averageAQI)}>
                          {state.averageAQI}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
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
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {state.hotspots.length} Hotspots
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge className={getStatusColor(state.averageWQI)}>
                          {state.averageWQI}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
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
