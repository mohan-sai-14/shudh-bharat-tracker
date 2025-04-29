import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WQIData } from "@/types";
import { getWQICategory, getWQIHealthMessage } from "@/lib/api";
import { InfoIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
      <div className="h-1.5" style={{ backgroundColor: color }} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Water Quality Index</CardTitle>
          <span className="text-sm text-muted-foreground">{city}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold" style={{ color }}>
            {Math.round(wqi)}
          </span>
          <span className="text-sm font-medium pb-1.5" style={{ color }}>
            {category}
          </span>
        </div>

        <Progress
          value={Math.min(100, (wqi / 5))}
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
                <h4 className="text-sm font-semibold">Components</h4>
                <div className="grid gap-2 text-sm">
                  {Object.entries(components).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span>{value.toFixed(2)} mg/L</span>
                    </div>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
    </Card>
  );
}
