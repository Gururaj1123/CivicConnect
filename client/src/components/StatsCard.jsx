export default function StatsCard({ label, value, tone = 'primary' }) {
  return (
    <div className={`stats-card stats-${tone}`}>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}
