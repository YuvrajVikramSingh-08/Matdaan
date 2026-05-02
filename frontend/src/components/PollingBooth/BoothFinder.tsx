import React, { useState } from 'react';
import { findBooths } from '../../services/api';
import type { PollingBooth } from '../../types';

interface BoothFinderProps {
  language: string;
  onToast: (msg: string, type: 'success' | 'info') => void;
}

export default function BoothFinder({ language, onToast }: BoothFinderProps) {
  const [booths, setBooths] = useState<PollingBooth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const handleFindBooths = async () => {
    setLoading(true);
    setError('');
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserLocation({ lat, lng });

      try {
        const data = await findBooths(lat, lng);
        setBooths(data.booths || []);
        onToast(`Found ${(data.booths || []).length} booths near you`, 'info');
      } catch {
        // Demo fallback data
        setBooths([
          { id: '1', name: 'Government School Polling Station', address: 'Sector 15, Near Market', lat: lat + 0.005, lng: lng + 0.003, distance: 0.8 },
          { id: '2', name: 'Community Hall Polling Booth', address: 'Block B, Main Road', lat: lat - 0.003, lng: lng + 0.006, distance: 1.2 },
          { id: '3', name: 'Municipal Office Voting Center', address: 'Civil Lines, Ward 7', lat: lat + 0.008, lng: lng - 0.002, distance: 1.8 },
        ]);
        onToast('Showing demo booth locations', 'info');
      }
    } catch {
      setManualMode(true);
      setError('Location access denied. Please enter your address manually.');
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    onToast('Address copied!', 'success');
  };

  const getDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  if (!booths.length && !loading) {
    return (
      <div className="booth-container">
        <div className="booth-prompt">
          <div className="icon">📍</div>
          <h3>Find Your Nearest Polling Booth</h3>
          <p>We'll use your location to find the closest polling stations within 5 km</p>
          {error && <p style={{ color: '#C62828', fontSize: '.82rem', marginBottom: 12 }}>{error}</p>}
          {manualMode ? (
            <div style={{ maxWidth: 360, margin: '0 auto' }}>
              <input className="form-input" placeholder="Enter your area or PIN code..." style={{ marginBottom: 8 }} />
              <button className="find-btn" onClick={handleFindBooths}>Search Booths</button>
            </div>
          ) : (
            <button className="find-btn" onClick={handleFindBooths} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, display: 'inline-block' }} /> : '📍 Find My Nearest Booth'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="booth-container">
      <div className="booth-map" aria-label="Map showing nearest polling booths">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🗺️</div>
          <p>Map view — requires Google Maps API key</p>
          {userLocation && <p style={{ fontSize: '.75rem' }}>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>}
        </div>
      </div>

      <h3 style={{ marginBottom: 12, fontSize: '.95rem' }}>📍 Nearby Polling Booths ({booths.length})</h3>
      <div className="booth-list">
        {booths.map(booth => (
          <div key={booth.id} className="booth-card">
            <h4>{booth.name}</h4>
            <p className="address">{booth.address}</p>
            <p className="distance">📏 {booth.distance} km away</p>
            <div className="booth-actions">
              <button className="booth-action-btn" onClick={() => getDirections(booth.lat, booth.lng)}>📍 Get Directions</button>
              <button className="booth-action-btn" onClick={() => copyAddress(booth.address)}>📋 Copy Address</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
