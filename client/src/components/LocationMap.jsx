// Free embedded map via OpenStreetMap's own embed endpoint - no API key,
// no billing, no rate limit concerns for a demo. Shows a small bounding
// box around the complaint's coordinates with a marker at the exact spot.
export default function LocationMap({ latitude, longitude, delta = 0.006 }) {
  if (!latitude || !longitude) return null;

  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;

  return (
    <div className="location-map">
      <iframe title="Complaint location map" src={src} loading="lazy" />
      <a href={fullMapUrl} target="_blank" rel="noreferrer" className="map-link">Open in full map ↗</a>
    </div>
  );
}
