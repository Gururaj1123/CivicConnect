import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard.jsx';
import { getPublicStats } from '../services/api.js';

const STEPS = [
  { title: 'Step 1 — Report', text: 'Citizen submits a civic issue with description, photo and location.' },
  { title: 'Step 2 — AI Prioritization', text: 'The system analyzes the complaint and assigns a priority.' },
  { title: 'Step 3 — Authority Action', text: 'The responsible department receives and processes the complaint.' },
  { title: 'Step 4 — Resolution', text: 'The citizen can track progress until the complaint is resolved.' },
];

export default function Home() {
  const [stats, setStats] = useState({ total: 1250, resolved: 820, responseRate: 94 });

  useEffect(() => {
    getPublicStats().then((res) => {
      if (res.success && res.stats.total > 0) setStats(res.stats);
    });
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Report Civic Issues. Track Real Progress.</h1>
        <p className="hero-subtitle">
          One platform for citizens to report public issues and authorities to manage, prioritize and resolve them efficiently.
        </p>
        <div className="hero-actions">
          <Link to="/report" className="btn btn-primary">Report an Issue</Link>
          <Link to="/track" className="btn btn-secondary">Track Complaint</Link>
        </div>
        <div className="hero-flow">
          <span>Citizen</span><span className="flow-arrow">→</span>
          <span>Complaint</span><span className="flow-arrow">→</span>
          <span>Authority</span><span className="flow-arrow">→</span>
          <span>Resolution</span>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className="step-card" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="platform-stats">
        <h2>Platform Statistics</h2>
        <div className="stats-grid">
          <StatsCard label="Issues Reported" value={`${stats.total.toLocaleString()}+`} tone="primary" />
          <StatsCard label="Issues Resolved" value={`${stats.resolved.toLocaleString()}+`} tone="success" />
          <StatsCard label="Response Rate" value={`${stats.responseRate}%`} tone="warning" />
        </div>
      </section>
    </div>
  );
}
