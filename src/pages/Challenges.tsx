
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollutionHotspot } from "@/types";
import { AlertTriangle, MapPin, Bell, BellOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Hotspots = () => {
  const [hotspots, setHotspots] = useState<PollutionHotspot[]>([]);
  const [notifications, setNotifications] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulated data - replace with actual API integration
    const fetchHotspots = async () => {
      try {
        // TODO: Replace with actual API calls
        const mockHotspots: PollutionHotspot[] = [
          {
            id: "1",
            location: "Anand Vihar, Delhi",
            lat: 28.6469,
            lng: 77.3161,
            aqi: 195,
            wqi: 155,
            severity: "Critical",
            description: "Industrial and traffic pollution hotspot",
            recommendations: [
              "Wear N95 masks when outdoors",
              "Avoid outdoor activities",
              "Use air purifiers indoors"
            ]
          },
          // Add more hotspots...
        ];
        setHotspots(mockHotspots);
      } catch (error) {
        console.error("Error fetching hotspots:", error);
      }
    };

    fetchHotspots();
  }, []);

  const toggleNotifications = () => {
    if (!notifications) {
      // Request notification permission
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-eco-dark-green">
            Pollution Hotspots
          </h1>
          <p className="text-muted-foreground">
            Critical pollution areas requiring immediate attention
          </p>
        </div>
        
        <Button
          variant={notifications ? "destructive" : "default"}
          onClick={toggleNotifications}
        >
          {notifications ? (
            <>
              <BellOff className="mr-2 h-4 w-4" />
              Disable Alerts
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Enable Alerts
            </>
          )}
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

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Safety Recommendations</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {hotspot.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Hotspots;
