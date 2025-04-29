import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AQIData } from '@/types';
import { getAQICategory } from '@/lib/api';
import { Card } from '../ui/card';

interface PollutionMapProps {
  pollutionData: Array<{
    city: string;
    coordinates: [number, number];
    aqi: AQIData;
  }>;
}

export function PollutionMap({ pollutionData }: PollutionMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="w-full h-full overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        className="w-full h-full"
        minZoom={4}
        maxZoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pollutionData.map(({ city, coordinates, aqi }) => {
          const { category, color } = getAQICategory(aqi.aqi);
          return (
            <Circle
              key={city}
              center={coordinates}
              radius={30000}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{city}</h3>
                  <div className="mt-2">
                    <p><span className="font-medium">AQI:</span> {aqi.aqi}</p>
                    <p><span className="font-medium">Status:</span> {category}</p>
                    {aqi.components && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Components:</p>
                        <ul className="text-sm space-y-1">
                          {Object.entries(aqi.components).map(([key, value]) => (
                            <li key={key}>
                              <span className="capitalize">{key.replace('_', ' ')}:</span>{' '}
                              {value.toFixed(1)} µg/m³
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </Card>
  );
}
