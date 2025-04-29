import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AQIData } from "@/types";
import { getAQICategory, getAQIHealthMessage } from "@/lib/api";
import { InfoIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface AQICardProps {
  data?: AQIData;
  city: string;
  className?: string;
}

export function AQICard({ data, city, className }: AQICardProps) {
  if (!data) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="h-1.5 bg-gray-200" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Air Quality Index</CardTitle>
            <span className="text-sm text-muted-foreground">{city}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No AQI data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const { aqi, components } = data;
  const { category, color } = getAQICategory(aqi);
  const healthMessage = getAQIHealthMessage(aqi);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Air Quality Index</CardTitle>
          <span className="text-sm text-muted-foreground">{city}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold" style={{ color }}>
            {Math.round(aqi)}
          </span>
          <span className="text-sm font-medium pb-1.5" style={{ color }}>
            {category}
          </span>
        </div>

        <Progress
          value={Math.min(100, (aqi / 5))}
          className="h-2.5 mb-4"
          indicatorClassName={cn("transition-all", {
            "bg-red-500": color === "maroon" || color === "red",
            "bg-yellow-500": color === "yellow",
            "bg-green-500": color === "green",
            "bg-orange-500": color === "orange",
          })}
        />

        <div className="flex items-start gap-1.5">
          <p className="text-sm text-muted-foreground flex-1">{healthMessage}</p>
          <HoverCard>
            <HoverCardTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help mt-0.5 flex-shrink-0" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Key Pollutants</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">PM2.5</span>
                    <span>{components.pm2_5.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">PM10</span>
                    <span>{components.pm10.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">NO₂</span>
                    <span>{components.no2.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">SO₂</span>
                    <span>{components.so2.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">CO</span>
                    <span>{components.co.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">O₃</span>
                    <span>{components.o3.toFixed(1)} μg/m³</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
    </Card>
  );
}
