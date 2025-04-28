
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Laptop, LucideIcon, Moon, RefreshCw, Sun } from "lucide-react";

interface SettingItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const SettingItem = ({ title, description, icon: Icon, checked, onCheckedChange }: SettingItemProps) => {
  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

const Settings = () => {
  const { toast } = useToast();
  
  // Settings state
  const [ecoMode, setEcoMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [highPollutionAlerts, setHighPollutionAlerts] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [dataSaving, setDataSaving] = useState(false);
  const [dataRefreshFrequency, setDataRefreshFrequency] = useState("hourly");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-dark-green">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences and notifications
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem 
                title="Eco Mode" 
                description="Reduce API calls and rendering for battery saving" 
                icon={Laptop}
                checked={ecoMode}
                onCheckedChange={setEcoMode}
              />
              
              <div className="space-y-2 pt-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label>Data Refresh Frequency</Label>
                <Select 
                  defaultValue={dataRefreshFrequency}
                  onValueChange={setDataRefreshFrequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time (high battery usage)</SelectItem>
                    <SelectItem value="hourly">Hourly (recommended)</SelectItem>
                    <SelectItem value="daily">Daily (low battery usage)</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you'd like to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem 
                title="Enable Notifications" 
                description="Receive important alerts and updates" 
                icon={Bell}
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              
              <SettingItem 
                title="High Pollution Alerts" 
                description="Get notified when AQI or WQI reaches unsafe levels" 
                icon={Bell}
                checked={highPollutionAlerts}
                onCheckedChange={setHighPollutionAlerts}
              />
              
              <div className="space-y-2 pt-2">
                <Label>Notification Method</Label>
                <Select defaultValue="in-app">
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-app">In-app only</SelectItem>
                    <SelectItem value="push">Push notifications</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="all">All methods</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data usage and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingItem 
                title="Location Tracking" 
                description="Allow app to use your location for accurate pollution data" 
                icon={Laptop}
                checked={locationTracking}
                onCheckedChange={setLocationTracking}
              />
              
              <SettingItem 
                title="Data Saving Mode" 
                description="Reduce data usage by loading lower quality maps and images" 
                icon={Laptop}
                checked={dataSaving}
                onCheckedChange={setDataSaving}
              />
              
              <div className="pt-4">
                <Button variant="outline" className="mr-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Local Data Cache
                </Button>
                <Button variant="outline" className="text-destructive">
                  Download My Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your profile and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Rohan Kumar" />
                </div>
                
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="rohan.kumar@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue="Bengaluru" />
                </div>
                
                <div className="pt-2">
                  <Button>Update Profile</Button>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Account Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    Change Password
                  </Button>
                  <Button variant="outline" className="text-destructive">
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
