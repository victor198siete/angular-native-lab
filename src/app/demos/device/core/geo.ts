import type { Address, Coordinates } from '@ng-native/expo/location';

const EARTH_RADIUS_M = 6_371_000;
const rad = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance in metres (haversine). Good to a few metres, which is plenty to decide "has it moved". */
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

/** One line from the platform's address: "street number, city, region, country", skipping what is missing. */
export function formatAddress(address: Address): string {
  const street = [address.street ?? address.name, address.streetNumber].filter(Boolean).join(' ');
  return [street, address.city ?? address.subregion, address.region, address.country].filter(Boolean).join(', ');
}

const pad = (n: number) => String(n).padStart(2, '0');

/** HH:MM:SS from a timestamp, in the phone's time zone. Not locale formatted: it reads the same in both languages. */
export function clockTime(at: number): string {
  const date = new Date(at);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** Whole points: "393". Android reports fractions (411.4), which read as noise next to the iOS values. */
export const points = (value: number): string => String(Math.round(value));
