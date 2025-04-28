
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollutionHotspot } from "@/types";
import { AlertTriangle, MapPin, Bell, BellOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchStatePollutionData } from "@/lib/api";

const Hotspots = () => {
  const [hotspots, setHotspots] = useState<PollutionHotspot[]>([]);
  const [notifications, setNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setLoading(true);
        const stateData = await fetchStatePollutionData();
        const allHotspots = stateData.flatMap(state => state.hotspots);
        setHotspots(allHotspots);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pollution hotspots');
        toast({
          title: "Error",
          description: "Failed to load pollution hotspots. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, [toast]);

  const toggleNotifications = () => {
    if (!notifications) {
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            setNotifications(true);
            toast({
              title: "Notifications Enabled",
              description: "You will receive alerts when near pollution hotspots.",
              duration: 3000,
            });
          }
        });
      }
    } else {
      setNotifications(false);
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive pollution alerts.",
        duration: 3000,
      });
    }
  };

  const getSeverityColor = (severity: PollutionHotspot['severity']) => {
    switch (severity) {
      case "High": return "bg-orange-100 text-orange-800";
      case "Critical": return "bg-red-100 text-red-800";
      case "Emergency": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Loading pollution hotspots...</div>;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-eco-dark-green">
            Pollution Hotspots
          </h1>
          <p className="text-muted-foreground">
            Critical areas requiring immediate attention
          </p>
        </div>
        <Button
          variant="outline"
          onClick={toggleNotifications}
          className="flex items-center gap-2"
        >
          {notifications ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {notifications ? "Disable Alerts" : "Enable Alerts"}
        </Button>
      </div>

      <div className="grid gap-6">
        {hotspots.map(hotspot => (
          <Card key={hotspot.id} className="overflow-hidden">
            <div 
              className="h-1.5" 
              style={{ 
                backgroundColor: hotspot.severity === "Emergency" ? "#7D1919" :
                               hotspot.severity === "Critical" ? "#F44336" :
                               "#FF9800"
              }} 
            />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {hotspot.location}
                </CardTitle>
                <Badge className={getSeverityColor(hotspot.severity)}>
                  {hotspot.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">Air Quality</div>
                    <div className="text-2xl font-bold text-red-600">
                      {hotspot.aqi}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Water Quality</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {hotspot.wqi}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{hotspot.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {hotspot.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Hotspots;
