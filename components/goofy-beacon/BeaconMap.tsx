'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { GroupStateMember } from '@/types/goofy-beacon';

interface BeaconMapProps {
  members: GroupStateMember[];
}

const disneyCenter: [number, number] = [28.3852, -81.5639];

export default function BeaconMap({ members }: BeaconMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView(disneyCenter, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    const dynamicLayer = L.layerGroup().addTo(map);

    const withPing = members.filter((member) => member.ping);
    withPing.forEach((member) => {
      const ping = member.ping!;
      const marker = L.circleMarker([ping.lat, ping.lng], {
        radius: 8,
        color: '#4f63ff',
        fillColor: '#4f63ff',
        fillOpacity: 0.75,
      });
      marker.bindPopup(
        `<strong>${member.display_name}</strong><br/>${ping.zone_label}<br/>${new Date(ping.pinged_at).toLocaleString()}<br/>±${ping.accuracy_m ?? 'n/a'}m`
      );
      marker.addTo(dynamicLayer);
    });

    if (withPing.length > 0) {
      const bounds = L.latLngBounds(withPing.map((member) => [member.ping!.lat, member.ping!.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.2));
    } else {
      map.setView(disneyCenter, 12);
    }

    return () => {
      map.removeLayer(dynamicLayer);
    };
  }, [members]);

  return <div ref={mapRef} className="h-[360px] w-full overflow-hidden rounded-xl border border-border" />;
}
