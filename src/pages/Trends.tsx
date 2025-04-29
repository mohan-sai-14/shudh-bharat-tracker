import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Bar, BarChart } from "recharts";
import { usePollution } from "@/contexts/PollutionContext";
import { CitySelector } from "@/components/pollution/CitySelector";
import { Skeleton } from "@/components/ui/skeleton";

// Generate mock historical pollution data
const generateHistoricalData = (days: number, baseAqi: number, baseWqi: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the data
    const randomAqiFactor = Math.random() * 30 - 15; // -15 to +15
    const randomWqiFactor = Math.random() * 20 - 10; // -10 to +10
    
    // Add some trend to make it look realistic (higher pollution on weekends)
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 15 : 0;
    
    const aqi = Math.max(10, Math.min(300, baseAqi + randomAqiFactor + weekendFactor));
    const wqi = Math.max(10, Math.min(300, baseWqi + randomWqiFactor));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      aqi: Math.round(aqi),
      wqi: Math.round(wqi)
    });
  }
  
  return data;
};

// Generate pollution component data
const generateComponentData = () => {
  return [
    { name: "PM2.5", value: Math.round(Math.random() * 70 + 30), limit: 60, unit: "μg/m³" },
    { name: "PM10", value: Math.round(Math.random() * 100 + 40), limit: 100, unit: "μg/m³" },
    { name: "NO₂", value: Math.round(Math.random() * 50 + 20), limit: 40, unit: "μg/m³" },
    { name: "SO₂", value: Math.round(Math.random() * 30 + 10), limit: 50, unit: "μg/m³" },
    { name: "CO", value: Math.round(Math.random() * 5 + 1), limit: 4, unit: "mg/m³" },
    { name: "O₃", value: Math.round(Math.random() * 100 + 10), limit: 100, unit: "μg/m³" },
  ];
};

interface TrendData {
  date: string;
  aqi: number;
  wqi: number;
}

const Trends = () => {
  const { cities, selectedCity, setSelectedCity, pollutionData, isLoading } = usePollution();
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days">("7days");
  
  // Extract numeric AQI and WQI values, defaulting to reasonable values if not available
  const baseAqi = typeof pollutionData?.aqi?.aqi === 'number' ? pollutionData.aqi.aqi : 80;
  const baseWqi = typeof pollutionData?.wqi?.wqi === 'number' ? pollutionData.wqi.wqi : 60;
  
  const historicalData: { [key: string]: TrendData[] } = {
    "7days": generateHistoricalData(7, baseAqi, baseWqi),
    "30days": generateHistoricalData(30, baseAqi, baseWqi),
    "90days": generateHistoricalData(90, baseAqi, baseWqi)
  };
  
  const componentData = generateComponentData();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-eco-dark-green">
            Pollution Trends & Analysis
          </h1>
          <p className="text-muted-foreground">
            Historical data and future predictions
          </p>
        </div>
        
        <CitySelector 
          cities={cities}
          selectedCity={selectedCity}
          onSelect={setSelectedCity}
        />
      </div>
      
      <Tabs
        defaultValue="7days"
        className="w-full"
        onValueChange={(value) => setTimeRange(value as "7days" | "30days" | "90days")}
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
          <TabsTrigger value="90days">Last 90 Days</TabsTrigger>
        </TabsList>
        
        <TabsContent value="7days" className="pt-4">
          <HistoricalTrendsContent data={historicalData["7days"]} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="30days" className="pt-4">
          <HistoricalTrendsContent data={historicalData["30days"]} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="90days" className="pt-4">
          <HistoricalTrendsContent data={historicalData["90days"]} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pollutant Breakdown (Air)</CardTitle>
            <CardDescription>Individual pollutant concentrations vs limits</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={componentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}`, name]} />
                  <Legend />
                  <Bar dataKey="value" name="Current Level" fill="#03A9F4" />
                  <Bar dataKey="limit" name="Safe Limit" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Air vs Water Quality Correlation</CardTitle>
            <CardDescription>Relationship between AQI and WQI over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historicalData[timeRange].filter((_, i) => i % 3 === 0)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    name="AQI"
                    stroke="#F44336"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wqi"
                    name="WQI"
                    stroke="#03A9F4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const HistoricalTrendsContent = ({ data, isLoading }: { data: TrendData[], isLoading: boolean }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historical Air Quality Index (AQI)</CardTitle>
          <CardDescription>Tracking daily air quality changes</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F44336" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F44336" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 'dataMax + 50']} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  name="AQI"
                  stroke="#F44336"
                  fillOpacity={1}
                  fill="url(#colorAqi)"
                />
                {/* Draw lines for AQI categories */}
                <CartesianGrid y={50} strokeDasharray="3 3" stroke="#4CAF50" strokeWidth={1} />
                <CartesianGrid y={100} strokeDasharray="3 3" stroke="#FFEB3B" strokeWidth={1} />
                <CartesianGrid y={150} strokeDasharray="3 3" stroke="#FF9800" strokeWidth={1} />
                <CartesianGrid y={200} strokeDasharray="3 3" stroke="#F44336" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Historical Water Quality Index (WQI)</CardTitle>
          <CardDescription>Tracking daily water quality changes</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#03A9F4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#03A9F4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 'dataMax + 50']} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="wqi"
                  name="WQI"
                  stroke="#03A9F4"
                  fillOpacity={1}
                  fill="url(#colorWqi)"
                />
                {/* Draw lines for WQI categories */}
                <CartesianGrid y={50} strokeDasharray="3 3" stroke="#4CAF50" strokeWidth={1} />
                <CartesianGrid y={100} strokeDasharray="3 3" stroke="#8BC34A" strokeWidth={1} />
                <CartesianGrid y={150} strokeDasharray="3 3" stroke="#FFEB3B" strokeWidth={1} />
                <CartesianGrid y={200} strokeDasharray="3 3" stroke="#FF9800" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
