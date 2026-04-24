'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Day } from '@/data/trip';
import { getCheckedPins, type Pin } from '@/lib/pins';

// Fix Leaflet default icon paths. Default behaviour looks up the image URLs
// relative to the bundled CSS which 404s under Next; point at a CDN instead.
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BOSTON_CENTER: [number, number] = [42.3601, -71.0589];
const NYC_CENTER: [number, number] = [40.7505, -73.9934];

function CityMap({
  title,
  center,
  pins,
  zoom,
}: {
  title: string;
  center: [number, number];
  pins: Pin[];
  zoom: number;
}) {
  useEffect(() => {
    // Invalidate Leaflet size on mount so the initial render fills the container.
    const t = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="city-map">
      <div className="city-map-header">
        <h3>{title}</h3>
        <span className="city-map-count">{pins.length} pinned</span>
      </div>
      <div className="map-wrap">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pins.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
              <Popup>
                <strong>{p.name}</strong>
                <br />
                <span style={{ fontSize: 11, color: '#5A6681' }}>{p.address}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default function MapsView({ days, checks }: { days: Day[]; checks: Record<string, boolean> }) {
  const pins = getCheckedPins(days, checks);
  const bostonPins = pins.filter((p) => p.city === 'boston');
  const nycPins = pins.filter((p) => p.city === 'nyc');
  const total = pins.length;

  return (
    <div className="maps-view">
      {total === 0 ? (
        <div className="maps-empty">
          Check places off on the day tabs to see them pinned here.
        </div>
      ) : null}
      <CityMap title="Boston" center={BOSTON_CENTER} pins={bostonPins} zoom={13} />
      <CityMap title="New York" center={NYC_CENTER} pins={nycPins} zoom={12} />
    </div>
  );
}
