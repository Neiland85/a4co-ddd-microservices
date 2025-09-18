'use client';

import { Polyline, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Route, RoutePoint } from '../types/routing-types';

interface RouteDisplayProps {
  route: Route;
  startPoint: RoutePoint;
  endPoint: RoutePoint;
  color?: string;
}

// Custom icons for start and end points
const createRouteIcon = (type: 'start' | 'end') => {
  const color = type === 'start' ? '#10b981' : '#ef4444';
  const label = type === 'start' ? 'A' : 'B';

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
        <circle cx="15" cy="15" r="8" fill="white"/>
        <text x="15" y="19" textAnchor="middle" fill="${color}" fontSize="12" fontWeight="bold">${label}</text>
      </svg>
    `)}`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -40],
  });
};

export default function RouteDisplay({
  route,
  startPoint,
  endPoint,
  color = '#3b82f6',
}: RouteDisplayProps) {
  // Convert geometry to LatLng format for Leaflet
  const positions: [number, number][] = route.geometry.map(([lng, lat]) => [lat, lng]);

  return (
    <>
      {/* Route polyline */}
      <Polyline positions={positions} color={color} weight={4} opacity={0.8} dashArray="0" />

      {/* Start point marker */}
      <Marker position={[startPoint.lat, startPoint.lng]} icon={createRouteIcon('start')} />

      {/* End point marker */}
      <Marker position={[endPoint.lat, endPoint.lng]} icon={createRouteIcon('end')} />
    </>
  );
}
