import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import LocationMap from '../components/LocationMap.jsx';
import { getComplaint, updateComplaint, resolveComplaint, isAuthorityLoggedIn } from '../services/api.js';

const DEPARTMENTS = [
  'Public Works Department',
  'Sanitation Department',
  'Water Supply Department',
  'Electrical Department',
  'Municipal Engineering Department',
];

export default function ComplaintReview() {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionPhoto, setResolutionPhoto] = useState(null);
  const [resolutionPreview, setResolutionPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function loadComplaint() {
    setLoading(true);
    const result = await getComplaint(complaintId);
    setLoading(false);
    if (result.success) {
      setComplaint(result.complaint);
    } else {
      setError(result.message);
    }
  }

  useEffect(() => {
    loadComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintId]);

  if (!isAuthorityLoggedIn()) {
    return <Navigate to="/authority/login" replace />;
  }

  async function handleAssign() {
    setActionLoading(true);
    const result = await updateComplaint(complaintId, { status: 'ASSIGNED', department: selectedDept });
    setActionLoading(false);
    setShowAssignModal(false);
    if (result.success) {
      setComplaint(result.complaint);
      setMessage(`Complaint assigned to ${selectedDept}.`);
    } else {
      setError(result.message);
    }
  }

  async function handleMarkInProgress() {
    setActionLoading(true);
    const result = await updateComplaint(complaintId, { status: 'IN_PROGRESS' });
    setActionLoading(false);
    if (result.success) {
      setComplaint(result.complaint);
      setMessage('Complaint marked as In Progress.');
    } else {
      setError(result.message);
    }
  }

  function handleResolutionPhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setResolutionPhoto(file);
    setResolutionPreview(URL.createObjectURL(file));
  }

  async function handleConfirmResolve() {
    setActionLoading(true);
    const result = await resolveComplaint(complaintId, resolutionPhoto);
    setActionLoading(false);
    setShowResolveModal(false);
    setResolutionPhoto(null);
    setResolutionPreview(null);
    if (result.success) {
      setComplaint(result.complaint);
      setMessage('Complaint successfully resolved.');
    } else {
      setError(result.message);
    }
  }

  if (loading) return <div className="page-container narrow"><p className="loading-text">Loading complaint…</p></div>;
  if (error && !complaint) return <div className="page-container narrow"><p className="field-error">{error}</p></div>;
  if (!complaint) return null;

  return (
    <div className="page-container narrow">
      <h1>Complaint Review</h1>
      {message && <p className="success-banner">{message}</p>}

      {complaint.possibleDuplicates?.length > 0 && (
        <p className="duplicate-note">
          ⚠️ {complaint.possibleDuplicates.length} similar unresolved complaint(s) reported nearby:{' '}
          {complaint.possibleDuplicates.map((id, i) => (
            <span key={id}>
              <Link to={`/authority/review/${id}`}>{id}</Link>
              {i < complaint.possibleDuplicates.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}

      <div className="review-card">
        <div className="detail-row"><span className="detail-label">Complaint ID</span><span className="detail-value">{complaint.complaintId}</span></div>
        <div className="detail-row"><span className="detail-label">Category</span><span className="detail-value">{complaint.category}</span></div>
        <div className="detail-row"><span className="detail-label">Description</span><span className="detail-value">{complaint.description}</span></div>
        <div className="detail-row"><span className="detail-label">Location</span><span className="detail-value">{complaint.location.address || '—'}</span></div>
        <div className="detail-row"><span className="detail-label">Latitude</span><span className="detail-value">{complaint.location.latitude}</span></div>
        <div className="detail-row"><span className="detail-label">Longitude</span><span className="detail-value">{complaint.location.longitude}</span></div>

        <LocationMap latitude={complaint.location.latitude} longitude={complaint.location.longitude} />

        {complaint.photoUrl && (
          <div className="detail-row">
            <span className="detail-label">Photo Evidence</span>
            <img className="evidence-photo" src={complaint.photoUrl} alt="Complaint evidence" />
          </div>
        )}

        <div className="detail-row"><span className="detail-label">AI Priority</span><span className="detail-value"><PriorityBadge level={complaint.priority.level} /></span></div>
        <div className="detail-row"><span className="detail-label">AI Reason</span><span className="detail-value">{complaint.priority.reason}</span></div>
        <div className="detail-row"><span className="detail-label">Priority Source</span><span className="detail-value">{complaint.priority.source === 'ai' ? 'AI model (Groq)' : 'Rule-based (AI unavailable)'}</span></div>
        <div className="detail-row"><span className="detail-label">Current Status</span><span className="detail-value"><StatusBadge status={complaint.status} /></span></div>
        <div className="detail-row"><span className="detail-label">Department</span><span className="detail-value">{complaint.department || 'Not Assigned'}</span></div>
        <div className="detail-row"><span className="detail-label">Created</span><span className="detail-value">{new Date(complaint.createdAt).toLocaleString()}</span></div>

        {complaint.resolutionPhotoUrl && (
          <div className="detail-row">
            <span className="detail-label">Resolution Photo</span>
            <img className="evidence-photo" src={complaint.resolutionPhotoUrl} alt="Proof of resolution" />
          </div>
        )}

        {complaint.rating?.score && (
          <div className="detail-row"><span className="detail-label">Citizen Rating</span><span className="detail-value">{complaint.rating.score}★ {complaint.rating.feedback && `— "${complaint.rating.feedback}"`}</span></div>
        )}
      </div>

      {/* Authority-only actions - never rendered on citizen-facing pages */}
      <div className="review-actions">
        <button className="btn btn-primary" onClick={() => setShowAssignModal(true)} disabled={actionLoading}>Assign to Department</button>
        <button className="btn btn-secondary" onClick={handleMarkInProgress} disabled={actionLoading || complaint.status === 'REPORTED'}>Mark In Progress</button>
        <button className="btn btn-success" onClick={() => setShowResolveModal(true)} disabled={actionLoading || complaint.status === 'RESOLVED'}>Mark Resolved</button>
      </div>

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Department</h3>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAssign} disabled={actionLoading}>
                {actionLoading ? 'Assigning…' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResolveModal && (
        <div className="modal-overlay" onClick={() => setShowResolveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Mark as Resolved</h3>
            <p className="modal-hint">Optionally attach a photo showing the completed work.</p>
            {!resolutionPreview ? (
              <label className="btn btn-secondary upload-btn">
                📷 Upload Resolution Photo
                <input type="file" accept="image/*" capture="environment" onChange={handleResolutionPhotoChange} hidden />
              </label>
            ) : (
              <div className="photo-preview">
                <img src={resolutionPreview} alt="Resolution proof preview" />
                <button type="button" className="btn-link" onClick={() => { setResolutionPhoto(null); setResolutionPreview(null); }}>Remove photo</button>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowResolveModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleConfirmResolve} disabled={actionLoading}>
                {actionLoading ? 'Resolving…' : 'Confirm Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
