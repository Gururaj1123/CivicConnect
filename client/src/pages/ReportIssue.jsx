import { Navigate } from 'react-router-dom';
import ComplaintForm from '../components/ComplaintForm.jsx';
import { isCitizenLoggedIn } from '../services/api.js';

export default function ReportIssue() {
  if (!isCitizenLoggedIn()) {
    return <Navigate to="/login" state={{ from: '/report' }} replace />;
  }

  return (
    <>
      <style>{`

        /* =========================================================
           REPORT ISSUE PAGE
           Presentation only — functionality unchanged
           ========================================================= */

        .report-page {
          min-height: 100vh;

          padding: 45px 22px 75px;

          background:
            radial-gradient(
              circle at 8% 5%,
              rgba(37, 99, 235, 0.09),
              transparent 27%
            ),
            radial-gradient(
              circle at 92% 15%,
              rgba(14, 165, 233, 0.08),
              transparent 26%
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


        /* =========================================================
           MAIN CONTENT
           ========================================================= */

        .report-page-inner {
          width: min(850px, 100%);

          margin: 0 auto;
        }


        /* =========================================================
           HEADER
           ========================================================= */

        .report-header {
          margin-bottom: 27px;

          animation:
            reportHeaderIn
            0.65s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .report-eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 9px;

          margin-bottom: 13px;

          color: #2563eb;

          font-size: 0.72rem;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.12em;
        }

        .report-eyebrow-icon {
          display: flex;

          align-items: center;

          justify-content: center;

          width: 28px;
          height: 28px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #0ea5e9
            );

          border-radius: 9px;

          font-size: 13px;

          box-shadow:
            0 7px 17px
              rgba(37, 99, 235, 0.2);
        }

        .report-title {
          margin: 0;

          color: #0f172a;

          font-size: clamp(
            2.15rem,
            5vw,
            3.2rem
          );

          line-height: 1.04;

          font-weight: 850;

          letter-spacing: -0.055em;
        }

        .report-subtitle {
          max-width: 680px;

          margin: 13px 0 0;

          color: #64748b;

          font-size: 0.96rem;

          line-height: 1.7;
        }


        /* =========================================================
           INFO STRIP
           ========================================================= */

        .report-info-strip {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 11px;

          margin-bottom: 18px;

          animation:
            reportInfoIn
            0.65s
            0.08s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .report-info-item {
          display: flex;

          align-items: center;

          gap: 11px;

          min-height: 63px;

          padding: 12px 14px;

          background:
            rgba(255, 255, 255, 0.82);

          border:
            1px solid
            rgba(226, 232, 240, 0.95);

          border-radius: 14px;

          box-shadow:
            0 8px 25px
              rgba(15, 23, 42, 0.04);

          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            border-color 0.22s ease;
        }

        .report-info-item:hover {
          transform: translateY(-2px);

          border-color: #dbe5f1;

          box-shadow:
            0 13px 30px
              rgba(15, 23, 42, 0.07);
        }

        .report-info-icon {
          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          width: 35px;
          height: 35px;

          color: #2563eb;

          background: #eff6ff;

          border-radius: 10px;

          font-size: 15px;
        }

        .report-info-text {
          min-width: 0;
        }

        .report-info-title {
          display: block;

          color: #334155;

          font-size: 0.76rem;

          font-weight: 750;
        }

        .report-info-description {
          display: block;

          margin-top: 2px;

          color: #94a3b8;

          font-size: 0.68rem;

          line-height: 1.35;
        }


        /* =========================================================
           FORM CARD
           ========================================================= */

        .report-form-card {
          position: relative;

          padding: 27px;

          background:
            rgba(255, 255, 255, 0.95);

          border:
            1px solid
            rgba(226, 232, 240, 0.95);

          border-radius: 21px;

          box-shadow:
            0 18px 55px
              rgba(15, 23, 42, 0.075);

          animation:
            reportCardIn
            0.7s
            0.13s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .report-form-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 25px;
          right: 25px;

          height: 3px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #0ea5e9,
              #38bdf8
            );

          border-radius:
            0 0 999px 999px;
        }


        /* =========================================================
           FORM HEADING
           ========================================================= */

        .report-form-heading {
          display: flex;

          align-items: flex-start;

          justify-content: space-between;

          gap: 15px;

          margin-bottom: 23px;
        }

        .report-form-heading-left {
          min-width: 0;
        }

        .report-form-heading h2 {
          margin: 0;

          color: #0f172a;

          font-size: 1.16rem;

          font-weight: 800;

          letter-spacing: -0.02em;
        }

        .report-form-heading p {
          margin: 6px 0 0;

          color: #94a3b8;

          font-size: 0.77rem;

          line-height: 1.5;
        }

        .report-required-badge {
          flex-shrink: 0;

          padding: 7px 10px;

          color: #475569;

          background: #f8fafc;

          border:
            1px solid
            #e2e8f0;

          border-radius: 999px;

          font-size: 0.67rem;

          font-weight: 750;
        }


        /* =========================================================
           FORM ELEMENT POLISH
           ========================================================= */

        .report-form-card .form-group {
          margin-bottom: 18px;
        }

        .report-form-card .field-label {
          display: block;

          margin-bottom: 7px;

          color: #334155;

          font-size: 0.76rem;

          font-weight: 750;

          letter-spacing: 0.01em;
        }

        .report-form-card input,
        .report-form-card textarea,
        .report-form-card select {
          width: 100%;

          box-sizing: border-box;

          color: #0f172a;

          background: #f8fafc;

          border:
            1.5px solid
            #e2e8f0;

          border-radius: 11px;

          outline: none;

          font-family: inherit;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .report-form-card input:hover,
        .report-form-card textarea:hover,
        .report-form-card select:hover {
          background: #ffffff;

          border-color: #cbd5e1;
        }

        .report-form-card input:focus,
        .report-form-card textarea:focus,
        .report-form-card select:focus {
          background: #ffffff;

          border-color: #2563eb;

          box-shadow:
            0 0 0 4px
              rgba(37, 99, 235, 0.08);
        }

        .report-form-card textarea {
          min-height: 130px;

          resize: vertical;
        }


        /* =========================================================
           BUTTON POLISH
           ========================================================= */

        .report-form-card button {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .report-form-card button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 10px 25px
              rgba(37, 99, 235, 0.22);
        }

        .report-form-card button:active:not(:disabled) {
          transform:
            translateY(0)
            scale(0.98);
        }

        .report-form-card button:disabled {
          opacity: 0.65;

          cursor: not-allowed;
        }


        /* =========================================================
           FOOTER NOTE
           ========================================================= */

        .report-security-note {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          margin-top: 18px;

          color: #94a3b8;

          font-size: 0.69rem;

          font-weight: 600;

          text-align: center;

          animation:
            reportFadeIn
            0.7s
            0.25s
            ease
            both;
        }

        .report-security-icon {
          color: #16a34a;

          font-size: 13px;
        }


        /* =========================================================
           MOBILE
           ========================================================= */

        @media (max-width: 700px) {

          .report-page {
            padding:
              32px 15px
              55px;
          }

          .report-title {
            font-size: 2.35rem;
          }

          .report-subtitle {
            font-size: 0.87rem;
          }

          .report-info-strip {
            grid-template-columns: 1fr;
          }

          .report-info-item {
            min-height: 57px;
          }

          .report-form-card {
            padding: 21px 17px;
            border-radius: 17px;
          }

          .report-form-heading {
            flex-direction: column;
          }

          .report-required-badge {
            align-self: flex-start;
          }

        }


        @media (max-width: 420px) {

          .report-page {
            padding:
              25px 11px
              45px;
          }

          .report-title {
            font-size: 2rem;
          }

          .report-form-card {
            padding: 18px 14px;
          }

          .report-form-card::before {
            left: 16px;
            right: 16px;
          }

        }


        /* =========================================================
           ACCESSIBILITY
           ========================================================= */

        .report-form-card input:focus-visible,
        .report-form-card textarea:focus-visible,
        .report-form-card select:focus-visible,
        .report-form-card button:focus-visible {
          outline:
            3px solid
            rgba(37, 99, 235, 0.15);

          outline-offset: 2px;
        }


        /* =========================================================
           ANIMATIONS
           ========================================================= */

        @keyframes reportHeaderIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes reportInfoIn {
          from {
            opacity: 0;
            transform:
              translateY(14px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes reportCardIn {
          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(0.985);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes reportFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {

          .report-page *,
          .report-page *::before,
          .report-page *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }

        }

      `}</style>


      <div className="report-page">

        <div className="report-page-inner">

          {/* =====================================================
              PAGE HEADER
              ===================================================== */}

          <header className="report-header">

            <div className="report-eyebrow">

              <span className="report-eyebrow-icon">
                +
              </span>

              CivicConnect • Citizen Services

            </div>

            <h1 className="report-title">
              Report an Issue
            </h1>

            <p className="report-subtitle">
              Help improve your community by reporting a civic
              issue. Provide accurate details so the appropriate
              department can review and resolve it efficiently.
            </p>

          </header>


          {/* =====================================================
              INFORMATION STRIP
              ===================================================== */}

          <div className="report-info-strip">

            <div className="report-info-item">

              <div className="report-info-icon">
                📍
              </div>

              <div className="report-info-text">

                <span className="report-info-title">
                  Location Required
                </span>

                <span className="report-info-description">
                  Help authorities identify the exact area.
                </span>

              </div>

            </div>


            <div className="report-info-item">

              <div className="report-info-icon">
                📝
              </div>

              <div className="report-info-text">

                <span className="report-info-title">
                  Clear Description
                </span>

                <span className="report-info-description">
                  Explain the issue with useful details.
                </span>

              </div>

            </div>


            <div className="report-info-item">

              <div className="report-info-icon">
                📷
              </div>

              <div className="report-info-text">

                <span className="report-info-title">
                  Photo Optional
                </span>

                <span className="report-info-description">
                  Add visual evidence when available.
                </span>

              </div>

            </div>

          </div>


          {/* =====================================================
              FORM CARD
              ===================================================== */}

          <section className="report-form-card">

            <div className="report-form-heading">

              <div className="report-form-heading-left">

                <h2>
                  Issue Details
                </h2>

                <p>
                  Complete the information below to submit your
                  complaint.
                </p>

              </div>

              <span className="report-required-badge">
                Required fields marked *
              </span>

            </div>


            {/* ORIGINAL FORM — COMPLETELY UNCHANGED */}

            <ComplaintForm />

          </section>


          {/* =====================================================
              FOOTER NOTE
              ===================================================== */}

          <div className="report-security-note">

            <span className="report-security-icon">
              ✓
            </span>

            Your complaint will be securely submitted to
            CivicConnect for review.

          </div>

        </div>

      </div>
    </>
  );
}