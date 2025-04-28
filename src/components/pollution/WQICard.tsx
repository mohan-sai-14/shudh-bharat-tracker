
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WQIData } from "@/types";
import { getWQICategory, getWQIHealthMessage } from "@/lib/api";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WQICardProps {
  data: WQIData;
  city: string;
  className?: string;
}

export function WQICard({ data, city, className }: WQICardProps) {
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
        
        <div className="text-sm text-muted-foreground flex items-start gap-1.5">
          <span>{healthMessage}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help mt-0.5" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="font-medium">Water Parameters:</p>
                <ul className="mt-1 space-y-0.5 text-xs">
                  <li>pH: {components.ph.toFixed(1)}</li>
                  <li>Dissolved Oxygen: {components.dissolved_oxygen.toFixed(1)} mg/L</li>
                  <li>Turbidity: {components.turbidity.toFixed(1)} NTU</li>
                  <li>Total Dissolved Solids: {components.total_dissolved_solids.toFixed(0)} mg/L</li>
                  <li>Nitrates: {components.nitrates.toFixed(1)} mg/L</li>
                  <li>Fecal Coliform: {components.fecal_coliform.toFixed(0)} CFU/100mL</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
