import { useLocation, Link, Navigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressTimeline from '../components/ProgressTimeline.jsx';

// Citizen-only success page. No authority actions are rendered here -
// citizens can only view and track, never assign/progress/resolve.
export default function ComplaintSuccess() {
  const { state } = useLocation();
  const complaint = state?.complaint;

  if (!complaint) {
    // Guard against direct navigation without a submitted complaint
    return <Navigate to="/report" replace />;
  }

  return (
    <div className="page-container narrow">
      <div className="success-card">
        <h1 className="success-title">Complaint Submitted ✓</h1>
        <p>Your civic complaint has been successfully registered.</p>

        <div className="success-details">
          <div><span className="detail-label">Complaint ID</span><span className="detail-value">{complaint.complaintId}</span></div>
          <div><span className="detail-label">Category</span><span className="detail-value">{complaint.category}</span></div>
          <div><span className="detail-label">Location</span><span className="detail-value">{complaint.location.address || `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`}</span></div>
          <div><span className="detail-label">Priority</span><span className="detail-value"><PriorityBadge level={complaint.priority.level} /></span></div>
          <div><span className="detail-label">Status</span><span className="detail-value"><StatusBadge status={complaint.status} /></span></div>
        </div>

        <p className="keep-id-note">Keep your Complaint ID to track the complaint.</p>

        {complaint.possibleDuplicates?.length > 0 && (
          <p className="duplicate-note">
            ⚠️ Heads up — {complaint.possibleDuplicates.length} similar complaint(s) were already reported nearby: {complaint.possibleDuplicates.join(', ')}. Yours has still been registered and will be tracked separately.
          </p>
        )}

        <ProgressTimeline status={complaint.status} />

        <div className="success-actions">
          <Link to="/track" className="btn btn-primary">Track This Complaint</Link>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
