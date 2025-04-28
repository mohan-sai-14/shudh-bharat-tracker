
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { City } from "@/types";
import { CheckIcon, ChevronsUpDown, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CitySelectorProps {
  cities: City[];
  selectedCity: City | null;
  onSelect: (city: City) => void;
}

export function CitySelector({ cities, selectedCity, onSelect }: CitySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between font-normal"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-eco-green" />
              {selectedCity?.name || "Select city..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search city..." />
            <CommandList>
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.name}
                    value={city.name}
                    onSelect={() => {
                      onSelect(city);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCity?.name === city.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
