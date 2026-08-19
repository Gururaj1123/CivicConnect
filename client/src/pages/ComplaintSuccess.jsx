import { useEffect, useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressTimeline from '../components/ProgressTimeline.jsx';

export default function ComplaintSuccess() {
  const { state } = useLocation();
  const complaint = state?.complaint;

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!complaint) return;

    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [complaint]);

  if (!complaint) {
    return <Navigate to="/report" replace />;
  }

  return (
    <>
      <style>{`

        /* =====================================================
           PREMIUM COMPLAINT SUCCESS PAGE
           ===================================================== */

        .complaint-success-page {
          min-height: 100vh;

          position: relative;
          overflow: hidden;

          display: flex;
          justify-content: center;
          align-items: flex-start;

          padding: 60px 20px 80px;

          color: #0f172a;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(37, 99, 235, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 12%,
              rgba(16, 185, 129, 0.08),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #f8fafc,
              #eef4f8
            );
        }


        /* =====================================================
           BACKGROUND DECORATION
           ===================================================== */

        .success-background-orb {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(2px);

          opacity: 0.55;
        }

        .success-orb-one {
          width: 280px;
          height: 280px;

          top: -120px;
          left: -100px;

          background:
            radial-gradient(
              circle,
              rgba(59, 130, 246, 0.12),
              transparent 70%
            );

          animation:
            orbFloatOne
            9s
            ease-in-out
            infinite;
        }

        .success-orb-two {
          width: 320px;
          height: 320px;

          right: -140px;
          top: 35%;

          background:
            radial-gradient(
              circle,
              rgba(16, 185, 129, 0.10),
              transparent 70%
            );

          animation:
            orbFloatTwo
            11s
            ease-in-out
            infinite;
        }


        /* =====================================================
           CONTAINER
           ===================================================== */

        .complaint-success-container {
          position: relative;
          z-index: 2;

          width: min(800px, 100%);

          margin: 0 auto;
        }


        /* =====================================================
           WAIT / CONFIRMATION CARD
           ===================================================== */

        .submission-wait {
          position: relative;

          min-height: 490px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          padding: 55px 30px;

          overflow: hidden;

          text-align: center;

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.97),
              rgba(248, 250, 252, 0.94)
            );

          border:
            1px solid
            rgba(255, 255, 255, 0.95);

          border-radius: 30px;

          box-shadow:
            0 30px 80px
              rgba(15, 23, 42, 0.10),
            0 4px 16px
              rgba(15, 23, 42, 0.04);

          backdrop-filter: blur(18px);

          animation:
            cardAppear
            0.9s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .submission-wait::before {
          content: "";

          position: absolute;

          top: 0;
          left: 15%;
          right: 15%;

          height: 2px;

          background:
            linear-gradient(
              90deg,
              transparent,
              #3b82f6,
              #10b981,
              transparent
            );

          opacity: 0.8;
        }

        .submission-wait::after {
          content: "";

          position: absolute;

          width: 400px;
          height: 400px;

          top: -250px;
          right: -180px;

          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(59, 130, 246, 0.06),
              transparent 70%
            );

          pointer-events: none;
        }


        /* =====================================================
           PREMIUM CHECK ICON
           ===================================================== */

        .success-check-wrapper {
          position: relative;

          width: 122px;
          height: 122px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 34px;
        }

        .success-check-circle {
          position: relative;
          z-index: 3;

          width: 78px;
          height: 78px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              145deg,
              #2563eb,
              #1d4ed8 48%,
              #0f766e
            );

          box-shadow:
            0 18px 40px
              rgba(37, 99, 235, 0.24),
            inset 0 1px 1px
              rgba(255, 255, 255, 0.35);

          animation:
            checkCircleAppear
            0.9s
            0.15s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .success-check-circle::before {
          content: "";

          position: absolute;

          inset: 6px;

          border-radius: 50%;

          border:
            1px solid
            rgba(255, 255, 255, 0.22);
        }

        .success-check {
          width: 29px;
          height: 16px;

          position: relative;

          margin-top: -4px;

          border-left:
            3px solid #ffffff;

          border-bottom:
            3px solid #ffffff;

          transform:
            rotate(-45deg);

          opacity: 0;

          animation:
            elegantCheck
            0.75s
            0.72s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }


        /* =====================================================
           GLOW RINGS
           ===================================================== */

        .success-check-ring {
          position: absolute;

          width: 98px;
          height: 98px;

          border-radius: 50%;

          border:
            1px solid
            rgba(37, 99, 235, 0.16);

          animation:
            ringPulse
            3s
            ease-out
            infinite;
        }

        .success-check-ring:nth-child(2) {
          animation-delay: 1.5s;

          border-color:
            rgba(16, 185, 129, 0.13);
        }


        /* =====================================================
           TEXT
           ===================================================== */

        .submission-wait h1 {
          position: relative;
          z-index: 2;

          margin: 0;

          color: #0f172a;

          font-size:
            clamp(1.65rem, 4vw, 2.25rem);

          font-weight: 850;

          line-height: 1.15;

          letter-spacing: -0.045em;

          animation:
            textReveal
            0.8s
            0.4s
            ease
            both;
        }

        .submission-wait > p {
          position: relative;
          z-index: 2;

          max-width: 530px;

          margin: 13px auto 0;

          color: #64748b;

          font-size: 0.91rem;

          line-height: 1.7;

          animation:
            textReveal
            0.8s
            0.55s
            ease
            both;
        }


        /* =====================================================
           STATUS MESSAGE
           ===================================================== */

        .submission-status {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          margin-top: 24px;

          padding: 8px 13px;

          color: #475569;

          background:
            rgba(248, 250, 252, 0.9);

          border:
            1px solid
            #e2e8f0;

          border-radius: 999px;

          font-size: 0.68rem;

          font-weight: 700;

          animation:
            textReveal
            0.8s
            0.7s
            ease
            both;
        }

        .status-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #10b981;

          box-shadow:
            0 0 0 4px
            rgba(16, 185, 129, 0.10);

          animation:
            dotPulse
            1.6s
            ease-in-out
            infinite;
        }


        /* =====================================================
           PROGRESS
           ===================================================== */

        .wait-progress {
          width: min(290px, 75%);

          height: 3px;

          margin-top: 24px;

          overflow: hidden;

          background: #e2e8f0;

          border-radius: 999px;

          animation:
            textReveal
            0.8s
            0.75s
            ease
            both;
        }

        .wait-progress-bar {
          width: 0%;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #0ea5e9,
              #10b981
            );

          border-radius: inherit;

          animation:
            progressFill
            3s
            cubic-bezier(0.4, 0, 0.2, 1)
            forwards;
        }

        .wait-small-text {
          margin-top: 10px !important;

          color: #94a3b8 !important;

          font-size: 0.67rem !important;

          font-weight: 650;

          animation:
            textReveal
            0.8s
            0.85s
            ease
            both;
        }


        /* =====================================================
           DETAILS CARD
           ===================================================== */

        .success-card-professional {
          padding: 31px;

          background:
            rgba(255, 255, 255, 0.97);

          border:
            1px solid
            rgba(226, 232, 240, 0.95);

          border-radius: 24px;

          box-shadow:
            0 25px 70px
              rgba(15, 23, 42, 0.09);

          animation:
            detailsAppear
            0.85s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .success-header {
          text-align: center;

          padding-bottom: 25px;

          border-bottom:
            1px solid #eef2f7;
        }

        .success-mini-icon {
          width: 58px;
          height: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 15px;

          color: white;

          background:
            linear-gradient(
              145deg,
              #2563eb,
              #0f766e
            );

          border-radius: 17px;

          font-size: 25px;

          box-shadow:
            0 12px 28px
              rgba(37, 99, 235, 0.18);
        }

        .success-title-professional {
          margin: 0;

          font-size:
            clamp(1.65rem, 4vw, 2.2rem);

          font-weight: 850;

          letter-spacing: -0.045em;
        }

        .success-description {
          max-width: 540px;

          margin: 9px auto 0;

          color: #64748b;

          font-size: 0.87rem;

          line-height: 1.6;
        }


        /* =====================================================
           DETAILS GRID
           ===================================================== */

        .success-details-professional {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 11px;

          margin-top: 24px;
        }

        .success-detail-item {
          padding: 15px 16px;

          background: #f8fafc;

          border:
            1px solid #e8edf3;

          border-radius: 12px;

          transition:
            transform 0.25s ease,
            background 0.25s ease,
            border-color 0.25s ease;
        }

        .success-detail-item:hover {
          transform: translateY(-2px);

          background: #ffffff;

          border-color: #d5dfeb;
        }

        .success-detail-item .detail-label {
          display: block;

          margin-bottom: 6px;

          color: #94a3b8;

          font-size: 0.65rem;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.07em;
        }

        .success-detail-item .detail-value {
          display: block;

          color: #334155;

          font-size: 0.82rem;

          font-weight: 700;

          word-break: break-word;
        }

        .complaint-id-value {
          color: #2563eb !important;

          font-size: 0.92rem !important;

          letter-spacing: 0.025em;
        }


        /* =====================================================
           KEEP ID NOTE
           ===================================================== */

        .keep-id-note-professional {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          margin: 21px 0 0;

          padding: 12px 15px;

          color: #1e40af;

          background: #eff6ff;

          border:
            1px solid #dbeafe;

          border-radius: 11px;

          font-size: 0.75rem;

          font-weight: 650;

          text-align: center;
        }


        /* =====================================================
           DUPLICATE WARNING
           ===================================================== */

        .duplicate-note-professional {
          margin-top: 14px;

          padding: 13px 15px;

          color: #92400e;

          background: #fffbeb;

          border:
            1px solid #fde68a;

          border-radius: 11px;

          font-size: 0.75rem;

          line-height: 1.55;
        }


        /* =====================================================
           TIMELINE
           ===================================================== */

        .success-timeline {
          margin-top: 27px;

          padding-top: 24px;

          border-top:
            1px solid #eef2f7;
        }


        /* =====================================================
           ACTIONS
           ===================================================== */

        .success-actions-professional {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 11px;

          margin-top: 27px;
        }

        .success-action {
          min-height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 0 18px;

          border-radius: 11px;

          font-size: 0.81rem;

          font-weight: 750;

          text-decoration: none;

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease;
        }

        .success-action-primary {
          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          box-shadow:
            0 8px 22px
              rgba(37, 99, 235, 0.18);
        }

        .success-action-primary:hover {
          transform: translateY(-2px);

          box-shadow:
            0 13px 30px
              rgba(37, 99, 235, 0.25);
        }

        .success-action-secondary {
          color: #334155;

          background: white;

          border:
            1px solid #dbe2ea;
        }

        .success-action-secondary:hover {
          transform: translateY(-2px);

          background: #f8fafc;

          border-color: #cbd5e1;

          box-shadow:
            0 8px 20px
              rgba(15, 23, 42, 0.06);
        }

        .success-action:active {
          transform: scale(0.98);
        }


        /* =====================================================
           ANIMATIONS
           ===================================================== */

        @keyframes cardAppear {
          from {
            opacity: 0;

            transform:
              translateY(25px)
              scale(0.975);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes checkCircleAppear {
          0% {
            opacity: 0;

            transform:
              scale(0.35)
              rotate(-12deg);
          }

          65% {
            opacity: 1;

            transform:
              scale(1.06)
              rotate(2deg);
          }

          100% {
            opacity: 1;

            transform:
              scale(1)
              rotate(0);
          }
        }

        @keyframes elegantCheck {
          0% {
            opacity: 0;

            clip-path:
              polygon(
                0 0,
                0 0,
                0 100%,
                0 100%
              );
          }

          100% {
            opacity: 1;

            clip-path:
              polygon(
                0 0,
                100% 0,
                100% 100%,
                0 100%
              );
          }
        }

        @keyframes ringPulse {
          0% {
            opacity: 0;

            transform: scale(0.65);
          }

          20% {
            opacity: 0.65;
          }

          100% {
            opacity: 0;

            transform: scale(1.35);
          }
        }

        @keyframes textReveal {
          from {
            opacity: 0;

            transform:
              translateY(8px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }

        @keyframes dotPulse {
          0%,
          100% {
            transform: scale(1);

            opacity: 0.7;
          }

          50% {
            transform: scale(1.3);

            opacity: 1;
          }
        }

        @keyframes detailsAppear {
          from {
            opacity: 0;

            transform:
              translateY(35px)
              scale(0.975);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes orbFloatOne {
          0%,
          100% {
            transform:
              translate(0, 0);
          }

          50% {
            transform:
              translate(30px, 20px);
          }
        }

        @keyframes orbFloatTwo {
          0%,
          100% {
            transform:
              translate(0, 0);
          }

          50% {
            transform:
              translate(-25px, -30px);
          }
        }


        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 650px) {

          .complaint-success-page {
            padding:
              30px 14px
              55px;
          }

          .submission-wait {
            min-height: 440px;

            padding:
              40px 20px;

            border-radius: 22px;
          }

          .success-card-professional {
            padding:
              22px 17px;

            border-radius: 19px;
          }

          .success-details-professional {
            grid-template-columns: 1fr;
          }

          .success-actions-professional {
            grid-template-columns: 1fr;
          }

        }


        @media (max-width: 420px) {

          .complaint-success-page {
            padding:
              22px 10px
              45px;
          }

          .success-check-wrapper {
            width: 105px;
            height: 105px;
          }

          .success-check-circle {
            width: 70px;
            height: 70px;
          }

          .success-check-ring {
            width: 86px;
            height: 86px;
          }

          .submission-wait h1 {
            font-size: 1.5rem;
          }

        }


        @media (prefers-reduced-motion: reduce) {

          .complaint-success-page *,
          .complaint-success-page *::before,
          .complaint-success-page *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }

        }

      `}</style>


      {/* Background decoration */}

      <div className="complaint-success-page">

        <div className="success-background-orb success-orb-one" />
        <div className="success-background-orb success-orb-two" />


        <div className="complaint-success-container">

          {!showDetails ? (

            /* =================================================
               PREMIUM 3 SECOND CONFIRMATION
               ================================================= */

            <div className="submission-wait">

              <div className="success-check-wrapper">

                <span className="success-check-ring" />
                <span className="success-check-ring" />

                <div className="success-check-circle">

                  <span className="success-check" />

                </div>

              </div>


              <h1>
                Response Recorded Successfully
              </h1>


              <p>
                Thank you for helping improve your community.
                Your complaint has been successfully recorded.
                Kindly wait while we prepare your complaint details.
              </p>


              <div className="submission-status">

                <span className="status-dot" />

                Securing your complaint information

              </div>


              <div className="wait-progress">

                <div className="wait-progress-bar" />

              </div>


              <p className="wait-small-text">
                Please wait a moment…
              </p>

            </div>

          ) : (

            /* =================================================
               COMPLAINT DETAILS
               ================================================= */

            <div className="success-card-professional">

              <div className="success-header">

                <div className="success-mini-icon">
                  ✓
                </div>

                <h1 className="success-title-professional">
                  Complaint Submitted
                </h1>

                <p className="success-description">
                  Your civic complaint has been successfully
                  registered and is now ready to be tracked.
                </p>

              </div>


              <div className="success-details-professional">

                <div className="success-detail-item">

                  <span className="detail-label">
                    Complaint ID
                  </span>

                  <span className="detail-value complaint-id-value">
                    {complaint.complaintId}
                  </span>

                </div>


                <div className="success-detail-item">

                  <span className="detail-label">
                    Category
                  </span>

                  <span className="detail-value">
                    {complaint.category}
                  </span>

                </div>


                <div className="success-detail-item">

                  <span className="detail-label">
                    Location
                  </span>

                  <span className="detail-value">
                    {complaint.location.address ||
                      `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`}
                  </span>

                </div>


                <div className="success-detail-item">

                  <span className="detail-label">
                    Priority
                  </span>

                  <span className="detail-value">
                    <PriorityBadge
                      level={complaint.priority.level}
                    />
                  </span>

                </div>


                <div className="success-detail-item">

                  <span className="detail-label">
                    Status
                  </span>

                  <span className="detail-value">
                    <StatusBadge
                      status={complaint.status}
                    />
                  </span>

                </div>

              </div>


              <p className="keep-id-note-professional">
                🔐 Keep your Complaint ID safe to track the
                progress of your complaint.
              </p>


              {complaint.possibleDuplicates?.length > 0 && (

                <p className="duplicate-note-professional">

                  ⚠️ Heads up —{' '}
                  {complaint.possibleDuplicates.length}
                  {' '}similar complaint(s) were already reported
                  nearby:{' '}
                  {complaint.possibleDuplicates.join(', ')}.
                  {' '}Yours has still been registered and will be
                  tracked separately.

                </p>

              )}


              <div className="success-timeline">

                <ProgressTimeline
                  status={complaint.status}
                />

              </div>


              <div className="success-actions-professional">

                <Link
                  to="/track"
                  className="
                    success-action
                    success-action-primary
                  "
                >
                  Track This Complaint
                </Link>


                <Link
                  to="/"
                  className="
                    success-action
                    success-action-secondary
                  "
                >
                  Back to Home
                </Link>

              </div>

            </div>

          )}

        </div>

      </div>
    </>
  );
}