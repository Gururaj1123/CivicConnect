import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import PriorityBadge from './PriorityBadge.jsx';
import ComplaintCard from './ComplaintCard.jsx';

export default function ComplaintTable({ complaints }) {
  const navigate = useNavigate();

  function handleReview(complaintId) {
    navigate(`/authority/review/${complaintId}`);
  }

  if (!complaints || complaints.length === 0) {
    return <p className="empty-state">No complaints match your search or filters.</p>;
  }

  return (
    <>
      <div className="table-wrapper desktop-only">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Category</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Department</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.complaintId}>
                <td>{c.complaintId}</td>
                <td>{c.category}</td>
                <td>{c.location?.address || '—'}</td>
                <td><PriorityBadge level={c.priority?.level} /></td>
                <td><StatusBadge status={c.status} /></td>
                <td>{c.department || '—'}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td><button className="btn btn-secondary btn-sm" onClick={() => handleReview(c.complaintId)}>Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-grid mobile-only">
        {complaints.map((c) => (
          <ComplaintCard key={c.complaintId} complaint={c} onReview={handleReview} />
        ))}
      </div>
    </>
  );
}
