
import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';
import { MapConfig } from './MapConfig';

interface IndiaMapProps {
  center: [number, number];
  marker?: { lat: number; lng: number; color: string };
}

const IndiaMap = ({ center, marker }: IndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [mapConfigClosed, setMapConfigClosed] = useState(
    localStorage.getItem('mapConfigClosed') === 'true'
  );

  useEffect(() => {
    if (!mapContainer.current || !mapConfigClosed) return;

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
        zoom: 4,
        extent: [
          ...fromLonLat([indiaBounds[0][0], indiaBounds[0][1]]),
          ...fromLonLat([indiaBounds[1][0], indiaBounds[1][1]])
        ],
        constrainOnlyCenter: true
      })
    });

    // Add marker if provided
    if (marker) {
      addMarker(marker);
    }

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [center, marker, mapConfigClosed]);

  // Function to add a marker to the map
  const addMarker = (markerData: { lat: number; lng: number; color: string }) => {
    if (!map.current) return;

    // Create vector layer for markers
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([markerData.lng, markerData.lat]))
    });

    // Style for the marker
    const markerStyle = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: markerData.color
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2
        })
      })
    });

    markerFeature.setStyle(markerStyle);

    // Create vector source and layer
    const vectorSource = new VectorSource({
      features: [markerFeature]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Add to map
    map.current.addLayer(vectorLayer);

    // Fly to marker location
    map.current.getView().animate({
      center: fromLonLat([markerData.lng, markerData.lat]),
      zoom: 8,
      duration: 1000
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
      </div>
    </>
  );
};

export default IndiaMap;
