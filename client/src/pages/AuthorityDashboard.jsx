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
    <>
      <style>{`

        /* =========================================================
           AUTHORITY DASHBOARD
           Presentation only — existing functionality unchanged
           ========================================================= */

        .authority-dashboard {
          min-height: 100vh;
          padding: 42px 28px 70px;

          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(37, 99, 235, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 94% 12%,
              rgba(14, 165, 233, 0.07),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #f1f5f9 100%
            );

          color: #0f172a;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .authority-dashboard-inner {
          width: min(1450px, 100%);
          margin: 0 auto;
        }


        /* =========================================================
           HEADER
           ========================================================= */

        .authority-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;

          margin-bottom: 30px;

          animation:
            authorityHeaderIn
            0.65s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .authority-header-left {
          min-width: 0;
        }

        .authority-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          margin-bottom: 11px;

          color: #2563eb;

          font-size: 0.74rem;
          font-weight: 800;

          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .authority-eyebrow-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #2563eb;

          box-shadow:
            0 0 0 5px rgba(37, 99, 235, 0.09);

          animation:
            authorityPulse
            2s
            ease-in-out
            infinite;
        }

        .authority-title {
          margin: 0;

          color: #0f172a;

          font-size: clamp(
            2.15rem,
            4vw,
            3.2rem
          );

          line-height: 1.05;

          font-weight: 850;

          letter-spacing: -0.055em;
        }

        .authority-subtitle {
          max-width: 680px;

          margin: 12px 0 0;

          color: #64748b;

          font-size: 0.96rem;

          line-height: 1.65;
        }

        .authority-status {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          flex-shrink: 0;

          padding: 10px 14px;

          color: #166534;

          background:
            rgba(240, 253, 244, 0.9);

          border: 1px solid #bbf7d0;

          border-radius: 999px;

          font-size: 0.76rem;

          font-weight: 750;

          box-shadow:
            0 5px 15px rgba(22, 101, 52, 0.06);
        }

        .authority-status-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #22c55e;

          box-shadow:
            0 0 0 4px rgba(34, 197, 94, 0.12);
        }


        /* =========================================================
           STATS
           ========================================================= */

        .authority-stats {
          display: grid;

          grid-template-columns:
            repeat(5, minmax(0, 1fr));

          gap: 15px;

          margin-bottom: 27px;

          animation:
            authorityStatsIn
            0.75s
            0.08s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .authority-stat {
          position: relative;

          min-height: 132px;

          padding: 21px;

          overflow: hidden;

          background:
            rgba(255, 255, 255, 0.9);

          border: 1px solid
            rgba(226, 232, 240, 0.95);

          border-radius: 18px;

          box-shadow:
            0 12px 35px
              rgba(15, 23, 42, 0.055);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .authority-stat::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;

          width: 100%;
          height: 3px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #38bdf8
            );

          transform:
            scaleX(0.25);

          transform-origin: left;

          transition:
            transform 0.35s ease;
        }

        .authority-stat:hover {
          transform: translateY(-4px);

          border-color: #d7e2f1;

          box-shadow:
            0 20px 42px
              rgba(15, 23, 42, 0.09);
        }

        .authority-stat:hover::before {
          transform: scaleX(1);
        }

        .authority-stat-label {
          color: #64748b;

          font-size: 0.75rem;

          font-weight: 750;

          text-transform: uppercase;

          letter-spacing: 0.055em;
        }

        .authority-stat-value {
          margin-top: 11px;

          color: #0f172a;

          font-size: 2.1rem;

          line-height: 1;

          font-weight: 850;

          letter-spacing: -0.045em;
        }

        .authority-stat-meta {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-top: 12px;

          color: #94a3b8;

          font-size: 0.72rem;

          font-weight: 600;
        }

        .authority-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          position: absolute;

          right: 18px;
          top: 18px;

          width: 39px;
          height: 39px;

          border-radius: 12px;

          color: #2563eb;

          background: #eff6ff;

          font-size: 17px;
        }


        /* =========================================================
           FILTER / SEARCH AREA
           ========================================================= */

        .authority-controls {
          padding: 20px;

          margin-bottom: 24px;

          background:
            rgba(255, 255, 255, 0.9);

          border:
            1px solid
            rgba(226, 232, 240, 0.95);

          border-radius: 19px;

          box-shadow:
            0 12px 35px
              rgba(15, 23, 42, 0.055);

          animation:
            authorityControlsIn
            0.7s
            0.16s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .authority-controls-top {
          display: flex;
          align-items: center;
          gap: 12px;

          margin-bottom: 13px;
        }

        .authority-search-wrapper {
          position: relative;

          flex: 1;
        }

        .authority-search-icon {
          position: absolute;

          left: 16px;
          top: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          width: 20px;
          height: 20px;

          color: #64748b;

          transform: translateY(-50%);

          pointer-events: none;

          font-size: 15px;
        }

        .authority-search {
          width: 100%;

          height: 51px;

          padding:
            0 17px
            0 46px;

          color: #0f172a;

          background: #f8fafc;

          border:
            1.5px solid
            #e2e8f0;

          border-radius: 12px;

          outline: none;

          font-family: inherit;

          font-size: 0.88rem;

          font-weight: 500;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .authority-search::placeholder {
          color: #94a3b8;
        }

        .authority-search:hover {
          background: #ffffff;

          border-color: #cbd5e1;
        }

        .authority-search:focus {
          background: #ffffff;

          border-color: #2563eb;

          box-shadow:
            0 0 0 4px
              rgba(37, 99, 235, 0.08);
        }

        .authority-filter-label {
          color: #64748b;

          font-size: 0.71rem;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.07em;
        }

        .authority-filter-row {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 11px;
        }

        .authority-select-wrapper {
          position: relative;
        }

        .authority-select-wrapper::after {
          content: "⌄";

          position: absolute;

          right: 14px;
          top: 50%;

          color: #64748b;

          font-size: 15px;

          transform:
            translateY(-57%);

          pointer-events: none;
        }

        .authority-select {
          width: 100%;

          height: 48px;

          padding:
            0 38px
            0 14px;

          color: #334155;

          background: #f8fafc;

          border:
            1px solid
            #e2e8f0;

          border-radius: 11px;

          outline: none;

          appearance: none;

          cursor: pointer;

          font-family: inherit;

          font-size: 0.82rem;

          font-weight: 650;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .authority-select:hover {
          background: #ffffff;

          border-color: #cbd5e1;
        }

        .authority-select:focus {
          background: #ffffff;

          border-color: #2563eb;

          box-shadow:
            0 0 0 4px
              rgba(37, 99, 235, 0.08);
        }


        /* =========================================================
           RESULT / LOADING
           ========================================================= */

        .authority-results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          margin: 0 2px 13px;

          animation:
            authorityFade
            0.4s
            ease
            both;
        }

        .authority-results-title {
          margin: 0;

          color: #0f172a;

          font-size: 1rem;

          font-weight: 800;

          letter-spacing: -0.01em;
        }

        .authority-results-count {
          padding: 6px 10px;

          color: #475569;

          background: #e2e8f0;

          border-radius: 999px;

          font-size: 0.7rem;

          font-weight: 750;
        }

        .authority-loading {
          display: flex;

          align-items: center;
          justify-content: center;

          min-height: 220px;

          padding: 40px;

          color: #64748b;

          background:
            rgba(255, 255, 255, 0.8);

          border:
            1px solid
            #e2e8f0;

          border-radius: 18px;

          font-size: 0.9rem;

          font-weight: 650;

          box-shadow:
            0 10px 30px
              rgba(15, 23, 42, 0.04);
        }

        .authority-loading-content {
          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 14px;
        }

        .authority-loader {
          width: 28px;
          height: 28px;

          border:
            3px solid
            #dbeafe;

          border-top-color: #2563eb;

          border-radius: 50%;

          animation:
            authoritySpin
            0.8s
            linear
            infinite;
        }


        /* =========================================================
           ERROR
           ========================================================= */

        .authority-error {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 20px;

          padding: 14px 16px;

          color: #b91c1c;

          background:
            linear-gradient(
              135deg,
              #fff7f7,
              #fef2f2
            );

          border:
            1px solid
            #fecaca;

          border-radius: 12px;

          font-size: 0.84rem;

          font-weight: 600;

          animation:
            authorityError
            0.3s
            ease
            both;
        }

        .authority-error-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          width: 21px;
          height: 21px;

          border-radius: 50%;

          color: #ffffff;

          background: #ef4444;

          font-size: 12px;

          font-weight: 800;
        }


        /* =========================================================
           TABLE CONTAINER
           ========================================================= */

        .authority-table-container {
          overflow: hidden;

          background:
            rgba(255, 255, 255, 0.94);

          border:
            1px solid
            #e2e8f0;

          border-radius: 18px;

          box-shadow:
            0 16px 45px
              rgba(15, 23, 42, 0.06);

          animation:
            authorityTableIn
            0.55s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }


        /* =========================================================
           OVERRIDE / POLISH COMMON TABLE STYLES
           ========================================================= */

        .authority-table-container table {
          width: 100%;

          border-collapse: separate;

          border-spacing: 0;
        }

        .authority-table-container th {
          padding: 15px 18px;

          color: #64748b;

          background:
            linear-gradient(
              180deg,
              #f8fafc,
              #f1f5f9
            );

          border-bottom:
            1px solid
            #e2e8f0;

          font-size: 0.69rem;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.065em;

          white-space: nowrap;
        }

        .authority-table-container td {
          padding: 16px 18px;

          color: #334155;

          border-bottom:
            1px solid
            #eef2f7;

          font-size: 0.83rem;

          vertical-align: middle;

          transition:
            background 0.18s ease;
        }

        .authority-table-container tbody tr {
          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .authority-table-container tbody tr:hover {
          background:
            #f8fbff;
        }

        .authority-table-container tbody tr:last-child td {
          border-bottom: none;
        }


        /* =========================================================
           RESPONSIVE
           ========================================================= */

        @media (max-width: 1100px) {

          .authority-stats {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

        }

        @media (max-width: 800px) {

          .authority-dashboard {
            padding:
              32px 17px
              55px;
          }

          .authority-header {
            align-items: flex-start;

            flex-direction: column;

            margin-bottom: 25px;
          }

          .authority-status {
            align-self: flex-start;
          }

          .authority-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 11px;
          }

          .authority-controls-top {
            flex-direction: column;

            align-items: stretch;
          }

          .authority-filter-row {
            grid-template-columns: 1fr;
          }

          .authority-table-container {
            overflow-x: auto;
          }

          .authority-table-container table {
            min-width: 750px;
          }

        }

        @media (max-width: 480px) {

          .authority-dashboard {
            padding:
              25px 11px
              45px;
          }

          .authority-title {
            font-size: 2.15rem;
          }

          .authority-subtitle {
            font-size: 0.87rem;
          }

          .authority-stats {
            grid-template-columns: 1fr;
          }

          .authority-stat {
            min-height: 115px;
          }

          .authority-controls {
            padding: 14px;
          }

          .authority-results-header {
            margin-left: 1px;
            margin-right: 1px;
          }

        }


        /* =========================================================
           ACCESSIBILITY
           ========================================================= */

        .authority-search:focus-visible,
        .authority-select:focus-visible {
          outline:
            3px solid
            rgba(37, 99, 235, 0.18);

          outline-offset: 2px;
        }

        @keyframes authorityHeaderIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes authorityStatsIn {
          from {
            opacity: 0;
            transform:
              translateY(18px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes authorityControlsIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes authorityTableIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes authorityFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes authorityError {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes authoritySpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes authorityPulse {
          0%,
          100% {
            box-shadow:
              0 0 0 4px
              rgba(37, 99, 235, 0.09);
          }

          50% {
            box-shadow:
              0 0 0 8px
              rgba(37, 99, 235, 0.03);
          }
        }

        @media (prefers-reduced-motion: reduce) {

          .authority-dashboard *,
          .authority-dashboard *::before,
          .authority-dashboard *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }

        }

      `}</style>


      <div className="authority-dashboard">

        <div className="authority-dashboard-inner">

          {/* =====================================================
              HEADER
              ===================================================== */}

          <header className="authority-header">

            <div className="authority-header-left">

              <div className="authority-eyebrow">
                <span className="authority-eyebrow-dot" />
                CivicConnect • Administration
              </div>

              <h1 className="authority-title">
                Authority Dashboard
              </h1>

              <p className="authority-subtitle">
                Monitor citizen complaints, assign departments,
                prioritize urgent issues, and track resolutions
                across the city.
              </p>

            </div>

            <div className="authority-status">
              <span className="authority-status-dot" />
              Authority Console Online
            </div>

          </header>


          {/* =====================================================
              STATS
              ===================================================== */}

          <div className="authority-stats">

            <div className="authority-stat">
              <div className="authority-stat-icon">
                📋
              </div>

              <div className="authority-stat-label">
                Total Complaints
              </div>

              <div className="authority-stat-value">
                {stats.total}
              </div>

              <div className="authority-stat-meta">
                All submitted complaints
              </div>
            </div>


            <div className="authority-stat">
              <div className="authority-stat-icon">
                📨
              </div>

              <div className="authority-stat-label">
                Reported
              </div>

              <div className="authority-stat-value">
                {stats.reported}
              </div>

              <div className="authority-stat-meta">
                Awaiting assignment
              </div>
            </div>


            <div className="authority-stat">
              <div className="authority-stat-icon">
                📌
              </div>

              <div className="authority-stat-label">
                Assigned
              </div>

              <div className="authority-stat-value">
                {stats.assigned}
              </div>

              <div className="authority-stat-meta">
                Department assigned
              </div>
            </div>


            <div className="authority-stat">
              <div className="authority-stat-icon">
                ⚙️
              </div>

              <div className="authority-stat-label">
                In Progress
              </div>

              <div className="authority-stat-value">
                {stats.inProgress}
              </div>

              <div className="authority-stat-meta">
                Currently being handled
              </div>
            </div>


            <div className="authority-stat">
              <div
                className="authority-stat-icon"
                style={{
                  color: '#16a34a',
                  background: '#f0fdf4'
                }}
              >
                ✓
              </div>

              <div className="authority-stat-label">
                Resolved
              </div>

              <div className="authority-stat-value">
                {stats.resolved}
              </div>

              <div className="authority-stat-meta">
                Successfully resolved
              </div>
            </div>

          </div>


          {/* =====================================================
              SEARCH + FILTERS
              ===================================================== */}

          <div className="authority-controls">

            <div className="authority-controls-top">

              <div className="authority-search-wrapper">

                <span className="authority-search-icon">
                  🔎
                </span>

                <input
                  type="text"
                  placeholder="Search by Complaint ID, category or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="authority-search"
                />

              </div>

            </div>


            <div className="authority-filter-row">

              <div className="authority-select-wrapper">

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="authority-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      Status: {s}
                    </option>
                  ))}
                </select>

              </div>


              <div className="authority-select-wrapper">

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="authority-select"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      Priority: {p}
                    </option>
                  ))}
                </select>

              </div>


              <div className="authority-select-wrapper">

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                  className="authority-select"
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      Department: {d}
                    </option>
                  ))}
                </select>

              </div>

            </div>

          </div>


          {/* =====================================================
              ERROR
              ===================================================== */}

          {error && (

            <p className="authority-error">

              <span className="authority-error-icon">
                !
              </span>

              <span>
                {error}
              </span>

            </p>

          )}


          {/* =====================================================
              RESULTS HEADER
              ===================================================== */}

          {!loading && !error && (

            <div className="authority-results-header">

              <h2 className="authority-results-title">
                Complaint Records
              </h2>

              <span className="authority-results-count">
                {complaints.length} result
                {complaints.length === 1 ? '' : 's'}
              </span>

            </div>

          )}


          {/* =====================================================
              COMPLAINT TABLE
              ===================================================== */}

          {loading ? (

            <div className="authority-loading">

              <div className="authority-loading-content">

                <span className="authority-loader" />

                <span>
                  Loading complaints…
                </span>

              </div>

            </div>

          ) : (

            <div className="authority-table-container">

              <ComplaintTable
                complaints={complaints}
              />

            </div>

          )}

        </div>

      </div>
    </>
  );
}