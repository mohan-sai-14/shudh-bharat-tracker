
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapConfig } from './MapConfig';

interface IndiaMapProps {
  center: [number, number];
  marker?: { lat: number; lng: number; color: string };
}

const IndiaMap = ({ center, marker }: IndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('mapbox_token')
  );

  useEffect(() => {
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 4,
      bounds: [
        [68.1766451354, 7.96553477623], // Southwest coordinates of India
        [97.4025614766, 35.4940095078]  // Northeast coordinates of India
      ],
      maxBounds: [
        [50.3516, -4.2317], // Southwest coordinates
        [114.3535, 39.4787] // Northeast coordinates
      ]
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.current?.remove();
    };
  }, [token, center]);

  useEffect(() => {
    if (!map.current || !marker) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Create new marker
    const el = document.createElement('div');
    el.className = 'w-4 h-4 rounded-full border-2 border-white shadow-lg';
    el.style.backgroundColor = marker.color;

    markerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([marker.lng, marker.lat])
      .addTo(map.current);

    // Fly to marker location
    map.current.flyTo({
      center: [marker.lng, marker.lat],
      zoom: 8,
      duration: 2000
    });
  }, [marker]);

  return (
    <>
      {!token && <MapConfig onTokenSubmit={setToken} />}
      <div className="relative w-full h-full min-h-[400px]">
        <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      </div>
    </>
  );
};

export default IndiaMap;
