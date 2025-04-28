
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PollutionAlertProps {
  aqi: number;
  className?: string;
}

export function PollutionAlert({ aqi, className }: PollutionAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  if (isDismissed || aqi <= 150) return null;
  
  const isEmergency = aqi > 300;
  
  return (
    <Alert 
      className={cn(
        "border-l-4 relative animation-pulse", 
        isEmergency ? "border-l-destructive bg-red-50" : "border-l-warning bg-amber-50",
        className
      )}
    >
      <AlertTriangle className={cn(
        "h-5 w-5", 
        isEmergency ? "text-destructive" : "text-warning"
      )} />
      <AlertTitle className={cn(
        "font-bold",
        isEmergency ? "text-destructive" : "text-warning"
      )}>
        {isEmergency ? "Emergency Health Alert" : "Health Advisory"}
      </AlertTitle>
      <AlertDescription className="text-gray-700 pr-8">
        {isEmergency 
          ? "Current air quality is hazardous. Stay indoors, use air purifiers, and wear N95 masks if you must go outside."
          : "Air quality is unhealthy. Sensitive groups should limit outdoor activities and consider wearing masks."
        }
      </AlertDescription>
      
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-2 h-6 w-6"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
