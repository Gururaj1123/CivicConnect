import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';

// Mobile-friendly card view of a complaint row, used when the
// ComplaintTable collapses to cards on small screens.
export default function ComplaintCard({ complaint, onReview }) {
  return (
    <div className="complaint-card">
      <div className="complaint-card-header">
        <strong>{complaint.complaintId}</strong>
        <PriorityBadge level={complaint.priority?.level} />
      </div>
      <p className="complaint-card-category">{complaint.category}</p>
      <p className="complaint-card-location">{complaint.location?.address || `${complaint.location?.latitude?.toFixed(3)}, ${complaint.location?.longitude?.toFixed(3)}`}</p>
      <div className="complaint-card-footer">
        <StatusBadge status={complaint.status} />
        <span className="complaint-card-dept">{complaint.department || '—'}</span>
      </div>
      <button className="btn btn-secondary btn-sm" onClick={() => onReview(complaint.complaintId)}>Review</button>
    </div>
  );
}
