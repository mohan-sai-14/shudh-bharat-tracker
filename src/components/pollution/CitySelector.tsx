import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City } from "@/types";

export interface CitySelectorProps {
  cities: City[];
  selectedCity: City | null;
  onSelect: (city: City) => void;
}

export function CitySelector({ cities, selectedCity, onSelect }: CitySelectorProps) {
  const handleSelect = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (city) {
      onSelect(city);
    }
  };

  return (
    <Select
      value={selectedCity?.name}
      onValueChange={handleSelect}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select city..." />
      </SelectTrigger>
      <SelectContent>
        {cities.map((city) => (
          <SelectItem
            key={city.name}
            value={city.name}
            className="flex items-center gap-2"
          >
            {city.name === selectedCity?.name && (
              <Check className="h-4 w-4" />
            )}
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
