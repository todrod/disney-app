import zones from '@/data/goofy-beacon/zones.json';
import { ZoneCircle } from '@/types/goofy-beacon';

const zoneList = zones as ZoneCircle[];

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

export function labelZone(lat: number, lng: number): string {
  let best: { label: string; delta: number } | null = null;

  for (const zone of zoneList) {
    const distance = haversineMeters(lat, lng, zone.lat, zone.lng);
    if (distance <= zone.radius_m) {
      const delta = zone.radius_m - distance;
      if (!best || delta > best.delta) {
        best = { label: zone.label, delta };
      }
    }
  }

  return best?.label ?? 'Around Walt Disney World';
}

export function getZones(): ZoneCircle[] {
  return zoneList;
}
