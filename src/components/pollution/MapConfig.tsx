
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MapConfigProps {
  onTokenSubmit: (token: string) => void;
}

export const MapConfig = ({ onTokenSubmit }: MapConfigProps) => {
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      onTokenSubmit(token);
      setIsVisible(false);
      // Store in localStorage for persistence
      localStorage.setItem("mapbox_token", token);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold">Map Configuration Required</h2>
        <p className="text-muted-foreground text-sm">
          Please enter your Mapbox public access token to display the map. You can get one for free at{" "}
          <a 
            href="https://mapbox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox public access token"
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Save Token
          </Button>
        </form>
      </div>
    </div>
  );
};
