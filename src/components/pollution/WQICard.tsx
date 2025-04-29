import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WQIData } from "@/types";
import { getWQICategory, getWQIHealthMessage } from "@/lib/api";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WQICardProps {
  data?: WQIData;
  city: string;
  className?: string;
}

export function WQICard({ data, city, className }: WQICardProps) {
  if (!data) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="h-1.5 bg-gray-200" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Water Quality Index</CardTitle>
            <span className="text-sm text-muted-foreground">{city}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No WQI data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const { wqi, components } = data;
  const { category, color } = getWQICategory(wqi);
  const healthMessage = getWQIHealthMessage(wqi);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div 
        className="h-1.5" 
        style={{ backgroundColor: color }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Water Quality Index</CardTitle>
          <span className="text-sm text-muted-foreground">
            {city}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold" style={{ color }}>
            {wqi}
          </span>
          <span 
            className="text-sm font-medium pb-1.5"
            style={{ color }}
          >
            {category}
          </span>
        </div>
        
        <Progress 
          value={Math.min(100, (wqi / 5))} 
          className="h-2.5 mb-4"
          indicatorColor={color}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-help">
                <InfoIcon className="h-4 w-4" />
                <span>Health Impact</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{healthMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {components && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium mb-3">Components</h4>
            {Object.entries(components).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">
                  {key.replace('_', ' ')}
                </span>
                <span>{value} mg/L</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
