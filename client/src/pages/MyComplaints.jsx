import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import { getMyComplaints, isCitizenLoggedIn, getCitizenName, citizenLogout } from '../services/api.js';

export default function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getMyComplaints();
      setLoading(false);
      if (result.success) {
        setComplaints(result.complaints);
      } else {
        setError(result.message);
      }
    }
    load();
  }, []);

  if (!isCitizenLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  function handleOpen(complaintId) {
    navigate('/track', { state: { complaintId } });
  }

  function handleLogout() {
    citizenLogout();
    navigate('/');
  }

  return (
    <div className="page-container">
      <div className="my-complaints-header">
        <div>
          <h1>My Complaints</h1>
          <p className="page-subtitle">Signed in as {getCitizenName()}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      {loading && <p className="loading-text">Loading your complaints…</p>}
      {error && <p className="field-error">{error}</p>}

      {!loading && !error && complaints.length === 0 && (
        <div className="empty-state-card">
          <p>You haven&apos;t reported any complaints yet.</p>
          <a href="/report" className="btn btn-primary">Report an Issue</a>
        </div>
      )}

      <div className="card-grid my-complaints-grid">
        {complaints.map((c) => (
          <button key={c.complaintId} className="complaint-card my-complaint-card" onClick={() => handleOpen(c.complaintId)}>
            <div className="complaint-card-header">
              <strong>{c.complaintId}</strong>
              <PriorityBadge level={c.priority?.level} />
            </div>
            <p className="complaint-card-category">{c.category}</p>
            <p className="complaint-card-location">{c.location?.address || `${c.location?.latitude?.toFixed(3)}, ${c.location?.longitude?.toFixed(3)}`}</p>
            <div className="complaint-card-footer">
              <StatusBadge status={c.status} />
              <span className="complaint-card-dept">{c.department || '—'}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
