
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

const IndiaMap = ({ center, markers = [], activeTab = 'aqi', onMarkerClick }: IndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const popupContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const overlay = useRef<Overlay | null>(null);
  const [mapConfigClosed, setMapConfigClosed] = useState(
    localStorage.getItem('mapConfigClosed') === 'true'
  );

  useEffect(() => {
    if (!mapContainer.current || !popupContainer.current || !mapConfigClosed) return;

    // Define India bounds
    const indiaBounds = [
      [68.1, 7.9], // Southwest coordinates of India
      [97.4, 35.5]  // Northeast coordinates of India
    ];

    // Create the map
    map.current = new Map({
      target: mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: 5,
        extent: [
          ...fromLonLat([indiaBounds[0][0], indiaBounds[0][1]]),
          ...fromLonLat([indiaBounds[1][0], indiaBounds[1][1]])
        ],
        constrainOnlyCenter: true
      })
    });

    // Create popup overlay
    overlay.current = new Overlay({
      element: popupContainer.current,
      autoPan: true,
      positioning: 'bottom-center',
      offset: [0, -10],
      autoPanAnimation: {
        duration: 250
      }
    });

    map.current.addOverlay(overlay.current);

    // Add markers if provided
    if (markers.length > 0) {
      addMarkers(markers);
    }

    // Add click event to close popup
    document.addEventListener('click', (e) => {
      if (popupContainer.current && !popupContainer.current.contains(e.target as Node) && 
          !e.target.className?.includes?.('ol-marker')) {
        overlay.current?.setPosition(undefined);
      }
    });

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
      document.removeEventListener('click', () => {});
    };
  }, [center, markers, mapConfigClosed, activeTab]);

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

    // Add click interaction
    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, feature => feature);
      
      if (feature) {
        const location = feature.get('location') as Location;
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        
        // Show popup with location info
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
          
          // Call the callback if provided
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
  };

  const handleCloseMapConfig = () => {
    setMapConfigClosed(true);
    localStorage.setItem('mapConfigClosed', 'true');
  };

  return (
    <>
      {!mapConfigClosed && <MapConfig onClose={handleCloseMapConfig} />}
      <div className="relative w-full h-full min-h-[400px]">
        <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
        <div 
          ref={popupContainer} 
          className="absolute z-10 transform -translate-x-1/2 pointer-events-auto" 
          style={{display: 'none'}}
        />
      </div>
    </>
  );
};

export default IndiaMap;
