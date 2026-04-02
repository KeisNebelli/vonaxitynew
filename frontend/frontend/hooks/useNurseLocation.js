'use client';
import { useState, useEffect, useCallback } from 'react';

/**
 * useNurseLocation
 * Tracks nurse's real-time GPS position using browser Geolocation API
 * Handles permissions, errors, and updates cleanly
 */
export function useNurseLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('unknown'); // unknown | granted | denied

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your device.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setPermission('granted');
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setPermission('denied');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Unable to get your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  // Watch position for real-time updates
  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) return null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setPermission('granted');
        setLoading(false);
      },
      (err) => {
        setPermission('denied');
        setError('Unable to track location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    return watchId;
  }, []);

  // Calculate distance between nurse and patient (in km)
  const distanceTo = useCallback((patientLat, patientLng) => {
    if (!location) return null;

    const R = 6371; // Earth radius km
    const dLat = ((patientLat - location.lat) * Math.PI) / 180;
    const dLon = ((patientLng - location.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((location.lat * Math.PI) / 180) *
        Math.cos((patientLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Estimate ETA (average 30 km/h in city)
    const etaMinutes = Math.round((distance / 30) * 60);

    return {
      km: distance.toFixed(1),
      etaMinutes,
      etaText: etaMinutes < 60
        ? `~${etaMinutes} min away`
        : `~${Math.round(etaMinutes / 60)}h ${etaMinutes % 60}min away`,
    };
  }, [location]);

  return { location, error, loading, permission, getLocation, watchLocation, distanceTo };
}
