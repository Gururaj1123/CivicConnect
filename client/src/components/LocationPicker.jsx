import { useState } from 'react';
import { reverseGeocode } from '../services/api.js';

export default function LocationPicker({ onLocationChange }) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setStatus('error');
      setError('Location services are not supported on this device/browser.');
      return;
    }

    setStatus('loading');
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCoords({ latitude, longitude });

        // Free reverse geocoding via OpenStreetMap Nominatim (no key needed)
        const resolvedAddress = await reverseGeocode(latitude, longitude);
        setAddress(resolvedAddress);
        setStatus('success');
        onLocationChange({ latitude, longitude, address: resolvedAddress });
      },
      (err) => {
        setStatus('error');
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission was denied. Please allow location access to submit a complaint.');
        } else {
          setError('Could not detect your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="location-picker">
      <label className="field-label">Complaint Location</label>
      <button type="button" className="btn btn-secondary" onClick={handleUseLocation} disabled={status === 'loading'}>
        {status === 'loading' ? 'Detecting location…' : '📍 Use Current Location'}
      </button>

      {status === 'success' && coords && (
        <div className="location-result">
          <p className="location-confirmed">Location detected ✓</p>
          <p>Latitude: {coords.latitude.toFixed(6)}</p>
          <p>Longitude: {coords.longitude.toFixed(6)}</p>
          {address && <p className="location-address">{address}</p>}
        </div>
      )}

      {status === 'error' && <p className="field-error">{error}</p>}
    </div>
  );
}
