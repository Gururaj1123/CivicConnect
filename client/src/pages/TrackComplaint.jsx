import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressTimeline from '../components/ProgressTimeline.jsx';
import StarRating from '../components/StarRating.jsx';
import { getComplaint, rateComplaint } from '../services/api.js';

export default function TrackComplaint() {
  const routerLocation = useLocation();
  const [complaintId, setComplaintId] = useState(routerLocation.state?.complaintId || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  const runTrack = useCallback(async (idToTrack) => {
    if (!idToTrack.trim()) {
      setError('Please enter a complaint ID.');
      return;
    }
    setLoading(true);
    setError('');
    setComplaint(null);
    setRatingMessage('');

    const result = await getComplaint(idToTrack.trim().toUpperCase());
    setLoading(false);

    if (result.success) {
      setComplaint(result.complaint);
    } else {
      setError(result.message);
    }
  }, []);

  // Arriving from "My Complaints" pre-fills the ID and searches immediately
  useEffect(() => {
    if (routerLocation.state?.complaintId) {
      runTrack(routerLocation.state.complaintId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleTrack(e) {
    e.preventDefault();
    runTrack(complaintId);
  }

  async function handleRate(score, feedback) {
    setRatingSubmitting(true);
    setRatingMessage('');
    const result = await rateComplaint(complaint.complaintId, score, feedback);
    setRatingSubmitting(false);

    if (result.success) {
      setComplaint(result.complaint);
      setRatingMessage('Thanks for your feedback!');
    } else {
      setRatingMessage(result.message);
    }
  }

  return (
    <div className="page-container narrow">
      <h1>Track Your Complaint</h1>
      <form className="track-form" onSubmit={handleTrack}>
        <input
          type="text"
          placeholder="Enter Complaint ID (e.g. CP-2026-0001)"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching…' : 'Track Complaint'}
        </button>
      </form>

      {error && <p className="field-error">{error}</p>}

      {complaint && (
        <div className="track-result-card">
          <div className="detail-row"><span className="detail-label">Complaint ID</span><span className="detail-value">{complaint.complaintId}</span></div>
          <div className="detail-row"><span className="detail-label">Category</span><span className="detail-value">{complaint.category}</span></div>
          <div className="detail-row"><span className="detail-label">Description</span><span className="detail-value">{complaint.description}</span></div>
          <div className="detail-row"><span className="detail-label">Location</span><span className="detail-value">{complaint.location.address || `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`}</span></div>
          {complaint.photoUrl && (
            <div className="detail-row">
              <span className="detail-label">Photo</span>
              <img className="evidence-photo" src={complaint.photoUrl} alt="Complaint evidence" />
            </div>
          )}
          <div className="detail-row"><span className="detail-label">AI Priority</span><span className="detail-value"><PriorityBadge level={complaint.priority.level} /></span></div>
          <div className="detail-row"><span className="detail-label">Department</span><span className="detail-value">{complaint.department || 'Not Assigned'}</span></div>
          <div className="detail-row"><span className="detail-label">Current Status</span><span className="detail-value"><StatusBadge status={complaint.status} /></span></div>
          <div className="detail-row"><span className="detail-label">Created</span><span className="detail-value">{new Date(complaint.createdAt).toLocaleString()}</span></div>

          {complaint.resolutionPhotoUrl && (
            <div className="detail-row">
              <span className="detail-label">Resolution Photo</span>
              <img className="evidence-photo" src={complaint.resolutionPhotoUrl} alt="Proof of resolution" />
            </div>
          )}

          {complaint.possibleDuplicates?.length > 0 && (
            <p className="duplicate-note">
              ℹ️ {complaint.possibleDuplicates.length} similar complaint(s) were already reported nearby when this was submitted.
            </p>
          )}

          <h3 className="timeline-heading">Progress</h3>
          <ProgressTimeline status={complaint.status} />

          {complaint.status === 'RESOLVED' && (
            complaint.rating?.score ? (
              <p className="success-banner">You rated this resolution {complaint.rating.score}★. Thank you!</p>
            ) : (
              <>
                <StarRating onSubmit={handleRate} submitting={ratingSubmitting} />
                {ratingMessage && <p className={ratingMessage.startsWith('Thanks') ? 'success-banner' : 'field-error'}>{ratingMessage}</p>}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
