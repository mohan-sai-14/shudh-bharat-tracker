
import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';
import { MapConfig } from './MapConfig';

interface Location {
  name: string;
  lat: number;
  lng: number;
  aqi?: number;
  wqi?: number;
  aqiColor?: string;
  wqiColor?: string;
}

interface IndiaMapProps {
  center: [number, number];
  markers?: Location[];
  activeTab?: 'aqi' | 'wqi';
  onMarkerClick?: (location: Location) => void;
}

export const IndiaMap = ({ center, markers = [], activeTab = 'aqi', onMarkerClick }: IndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const popupContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const overlay = useRef<Overlay | null>(null);
  const [mapConfigClosed, setMapConfigClosed] = useState(
    localStorage.getItem('mapConfigClosed') === 'true'
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}+india&countrycode=in&limit=10&key=${process.env.OPENCAGE_API_KEY}`
      );
      const data = await response.json();

      const locations = data.results
        .filter((result: any) => result.components._type === "city" || result.components._type === "town")
        .map((result: any) => ({
          name: result.formatted.split(',')[0],
          lat: result.geometry.lat,
          lng: result.geometry.lng
        }));

      setSearchResults(locations);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
    setIsSearching(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchLocation(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Function to add markers to the map
  const addMarkers = (locations: Location[]) => {
    if (!map.current) return;

    // Create features for all markers
    const features = locations.map(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([location.lng, location.lat])),
        name: location.name,
        location: location
      });

      // Determine which value and color to use based on active tab
      const value = activeTab === 'aqi' ? location.aqi : location.wqi;
      const color = activeTab === 'aqi' ? location.aqiColor : location.wqiColor;

      // Style for the marker
      const markerStyle = new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: color || '#4CAF50'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2
          })
        }),
        text: new Text({
          text: value ? value.toString() : '',
          font: '12px sans-serif',
          fill: new Fill({
            color: '#fff'
          }),
          stroke: new Stroke({
            color: '#000',
            width: 2
          }),
          offsetY: -15
        })
      });

      feature.setStyle(markerStyle);
      return feature;
    });

    // Create vector source and layer
    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      className: 'ol-marker-layer'
    });

    // Remove existing marker layers
    map.current.getLayers().forEach(layer => {
      if (layer && layer.getClassName?.() === 'ol-marker-layer') {
        map.current?.removeLayer(layer);
      }
    });

    // Add to map
    map.current.addLayer(vectorLayer);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create the map
    const newMap = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]),
        zoom: 5,
        minZoom: 4,
        maxZoom: 12
      })
    });

    map.current = newMap;

    // Add markers if provided
    if (markers.length > 0) {
      addMarkers(markers);
    }

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !popupContainer.current) return;

    // Create popup overlay
    const newOverlay = new Overlay({
      element: popupContainer.current,
      autoPan: true,
      positioning: 'bottom-center',
      offset: [0, -10]
    });

    map.current.addOverlay(newOverlay);
    overlay.current = newOverlay;

    // Add click event
    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, feature => feature);

      if (feature) {
        const location = feature.get('location') as Location;
        const coordinates = (feature.getGeometry() as Point).getCoordinates();

        if (popupContainer.current && overlay.current) {
          popupContainer.current.innerHTML = `
            <div class="p-3 bg-white rounded-lg shadow-lg">
              <h4 class="font-bold">${location.name}</h4>
              <div class="grid grid-cols-2 gap-2 mt-1 text-sm">
                <div>AQI: <span class="font-semibold" style="color:${location.aqiColor}">${location.aqi || 'N/A'}</span></div>
                <div>WQI: <span class="font-semibold" style="color:${location.wqiColor}">${location.wqi || 'N/A'}</span></div>
              </div>
            </div>
          `;
          overlay.current.setPosition(coordinates);

          if (onMarkerClick) {
            onMarkerClick(location);
          }
        }
      } else {
        if (overlay.current) {
          overlay.current.setPosition(undefined);
        }
      }
    });

    return () => {
      if (map.current && overlay.current) {
        map.current.removeOverlay(overlay.current);
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && markers.length > 0) {
      addMarkers(markers);
    }
  }, [markers, activeTab]);

  const handleCloseMapConfig = () => {
    setMapConfigClosed(true);
    localStorage.setItem('mapConfigClosed', 'true');
  };

  return (
    <>
      {!mapConfigClosed && <MapConfig onClose={handleCloseMapConfig} />}
      <div className="relative w-full h-full min-h-[400px]">
        <div 
          ref={mapContainer} 
          className="absolute inset-0 rounded-lg"
          style={{ background: '#f8f9fa' }}
        />
        <div 
          ref={popupContainer} 
          className="absolute z-10 transform -translate-x-1/2 pointer-events-auto" 
          style={{display: 'none'}}
        />
        <input 
          type="text" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          placeholder="Search locations..." 
          className="absolute top-4 left-4 z-10 p-2 rounded-md border shadow-sm"
        />
        {isSearching && (
          <p className="absolute top-16 left-4 z-10 bg-white p-2 rounded-md shadow-sm">
            Searching...
          </p>
        )}
        {searchResults.length > 0 && (
          <ul className="absolute top-16 left-4 z-10 bg-white rounded-md shadow-sm max-h-48 overflow-y-auto">
            {searchResults.map(result => (
              <li 
                key={result.name} 
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (map.current) {
                    map.current.getView().animate({
                      center: fromLonLat([result.lng, result.lat]),
                      zoom: 10
                    });
                  }
                }}
              >
                {result.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default IndiaMap;
