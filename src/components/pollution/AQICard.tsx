
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AQIData } from "@/types";
import { getAQICategory, getAQIHealthMessage } from "@/lib/api";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AQICardProps {
  data: AQIData;
  city: string;
  className?: string;
}

export function AQICard({ data, city, className }: AQICardProps) {
  const { aqi, components } = data;
  const { category, color } = getAQICategory(aqi);
  const healthMessage = getAQIHealthMessage(aqi);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div 
        className="h-1.5" 
        style={{ backgroundColor: color }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Air Quality Index</CardTitle>
          <span className="text-sm text-muted-foreground">
            {city}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold" style={{ color }}>
            {aqi}
          </span>
          <span 
            className="text-sm font-medium pb-1.5"
            style={{ color }}
          >
            {category}
          </span>
        </div>
        
        <Progress 
          value={Math.min(100, (aqi / 5))} 
          className="h-2.5 mb-4"
          indicatorColor={color}
        />
        
        <div className="text-sm text-muted-foreground flex items-start gap-1.5">
          <span>{healthMessage}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help mt-0.5" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-medium">Key Pollutants:</p>
                <ul className="mt-1 space-y-0.5 text-xs">
                  <li>PM2.5: {components.pm2_5.toFixed(1)} μg/m³</li>
                  <li>PM10: {components.pm10.toFixed(1)} μg/m³</li>
                  <li>NO₂: {components.no2.toFixed(1)} μg/m³</li>
                  <li>SO₂: {components.so2.toFixed(1)} μg/m³</li>
                  <li>CO: {components.co.toFixed(1)} μg/m³</li>
                  <li>O₃: {components.o3.toFixed(1)} μg/m³</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
