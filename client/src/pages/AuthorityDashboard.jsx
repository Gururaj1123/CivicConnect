import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard.jsx';
import ComplaintTable from '../components/ComplaintTable.jsx';
import { getAllComplaints, isAuthorityLoggedIn } from '../services/api.js';

const STATUS_OPTIONS = ['All', 'Reported', 'Assigned', 'In Progress', 'Resolved'];
const STATUS_MAP = { Reported: 'REPORTED', Assigned: 'ASSIGNED', 'In Progress': 'IN_PROGRESS', Resolved: 'RESOLVED' };
const PRIORITY_OPTIONS = ['All', 'P1', 'P2', 'P3', 'P4'];
const DEPARTMENT_OPTIONS = ['All', 'Public Works Department', 'Sanitation Department', 'Water Supply Department', 'Electrical Department', 'Municipal Engineering Department'];

export default function AuthorityDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, reported: 0, assigned: 0, inProgress: 0, resolved: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    const result = await getAllComplaints({
      search: search || undefined,
      status: status !== 'All' ? STATUS_MAP[status] : undefined,
      priority: priority !== 'All' ? priority : undefined,
      department: department !== 'All' ? department : undefined,
    });
    setLoading(false);

    if (result.success) {
      setComplaints(result.complaints);
      setStats(result.stats);
    } else {
      setError(result.message);
    }
  }, [search, status, priority, department]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  if (!isAuthorityLoggedIn()) {
    return <Navigate to="/authority/login" replace />;
  }

  return (
    <div className="page-container">
      <h1>Authority Dashboard</h1>

      <div className="stats-grid">
        <StatsCard label="Total Complaints" value={stats.total} tone="primary" />
        <StatsCard label="Reported" value={stats.reported} tone="neutral" />
        <StatsCard label="Assigned" value={stats.assigned} tone="warning" />
        <StatsCard label="In Progress" value={stats.inProgress} tone="primary" />
        <StatsCard label="Resolved" value={stats.resolved} tone="success" />
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search by Complaint ID, category or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="filter-row">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {DEPARTMENT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="field-error">{error}</p>}
      {loading ? <p className="loading-text">Loading complaints…</p> : <ComplaintTable complaints={complaints} />}
    </div>
  );
}
