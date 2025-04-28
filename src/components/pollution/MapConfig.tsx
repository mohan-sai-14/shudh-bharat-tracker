
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MapConfigProps {
  onClose: () => void;
}

export const MapConfig = ({ onClose }: MapConfigProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleContinue = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold">Map Information</h2>
        <p className="text-muted-foreground text-sm">
          You are about to view an interactive map of India showing pollution levels. 
          The map uses open-source data to display pollution information.
        </p>
        <Button onClick={handleContinue} className="w-full">
          Continue to Map
        </Button>
      </div>
    </div>
  );
};
