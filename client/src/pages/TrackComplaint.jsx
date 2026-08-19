import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProgressTimeline from '../components/ProgressTimeline.jsx';
import StarRating from '../components/StarRating.jsx';
import { getComplaint, rateComplaint } from '../services/api.js';

export default function TrackComplaint() {
  const routerLocation = useLocation();

  const [complaintId, setComplaintId] = useState(
    routerLocation.state?.complaintId || ''
  );

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

    // Start timer when animation begins
    const startTime = Date.now();

    const result = await getComplaint(
      idToTrack.trim().toUpperCase()
    );

    /*
     * Keep the animation visible for at least 1.8 seconds.
     * This prevents the animation from disappearing too quickly
     * when the API responds very fast.
     */
    const elapsedTime = Date.now() - startTime;
    const minimumDisplayTime = 2000;

    const remainingTime = Math.max(
      0,
      minimumDisplayTime - elapsedTime
    );

    if (remainingTime > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );
    }

    setLoading(false);

    if (result.success) {
      setComplaint(result.complaint);
    } else {
      setError(result.message);
    }
  }, []);

  // Arriving from "My Complaints" pre-fills the ID
  // and searches immediately.
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

    const result = await rateComplaint(
      complaint.complaintId,
      score,
      feedback
    );

    setRatingSubmitting(false);

    if (result.success) {
      setComplaint(result.complaint);
      setRatingMessage('Thanks for your feedback!');
    } else {
      setRatingMessage(result.message);
    }
  }

  return (
    <>
      <style>{`

        /* =====================================================
           MAIN PAGE
           ===================================================== */

        .track-page {
          min-height: 100vh;
          width: 100%;

          padding: 52px 24px 80px;

          background:
            radial-gradient(
              circle at 10% 5%,
              rgba(37, 99, 235, 0.07),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(14, 165, 233, 0.055),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #f1f5f9 100%
            );

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: #0f172a;
        }

        .track-wrapper {
          width: min(950px, 100%);
          margin: 0 auto;
        }


        /* =====================================================
           HEADER
           ===================================================== */

        .track-header {
          margin-bottom: 30px;

          animation:
            trackFadeDown
            0.6s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .track-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 12px;

          color: #2563eb;

          font-size: 0.75rem;
          font-weight: 800;

          text-transform: uppercase;
          letter-spacing: 0.10em;
        }

        .track-eyebrow-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #2563eb;

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.10);
        }

        .track-title {
          margin: 0;

          color: #0f172a;

          font-size: clamp(
            2.15rem,
            5vw,
            3.25rem
          );

          line-height: 1.05;

          letter-spacing: -0.055em;

          font-weight: 850;
        }

        .track-description {
          max-width: 650px;

          margin: 14px 0 0;

          color: #64748b;

          font-size: 1rem;

          line-height: 1.7;
        }


        /* =====================================================
           SEARCH CARD
           ===================================================== */

        .track-search-card {
          position: relative;

          padding: 7px;

          margin-bottom: 28px;

          background:
            rgba(255, 255, 255, 0.88);

          border: 1px solid
            rgba(226, 232, 240, 0.95);

          border-radius: 18px;

          box-shadow:
            0 15px 45px rgba(15, 23, 42, 0.07),
            0 3px 10px rgba(15, 23, 42, 0.04);

          backdrop-filter: blur(12px);

          animation:
            trackCardIn
            0.7s
            0.08s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .track-form {
          display: grid;

          grid-template-columns: 1fr auto;

          gap: 8px;

          width: 100%;
        }

        .track-input-wrapper {
          position: relative;

          display: flex;
          align-items: center;
        }

        .track-input-icon {
          position: absolute;

          left: 17px;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 22px;
          height: 22px;

          color: #64748b;

          font-size: 17px;

          pointer-events: none;
        }

        .track-input {
          width: 100%;
          height: 56px;

          padding:
            0 17px
            0 48px;

          color: #0f172a;

          background: #f8fafc;

          border: 1.5px solid #e2e8f0;

          border-radius: 13px;

          outline: none;

          font-family: inherit;

          font-size: 0.96rem;

          font-weight: 500;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .track-input::placeholder {
          color: #94a3b8;
        }

        .track-input:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .track-input:focus {
          background: #ffffff;

          border-color: #2563eb;

          transform: translateY(-1px);

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.09),
            0 8px 20px rgba(37, 99, 235, 0.06);
        }


        /* =====================================================
           BUTTON
           ===================================================== */

        .track-button {
          position: relative;
          isolation: isolate;

          min-width: 165px;
          height: 56px;

          padding: 0 23px;

          overflow: hidden;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          border: none;

          border-radius: 13px;

          cursor: pointer;

          font-family: inherit;

          font-size: 0.9rem;

          font-weight: 750;

          box-shadow:
            0 10px 22px
              rgba(37, 99, 235, 0.23);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .track-button::before {
          content: "";

          position: absolute;

          left: -130%;
          top: 0;

          width: 70%;
          height: 100%;

          background:
            linear-gradient(
              100deg,
              transparent,
              rgba(255, 255, 255, 0.28),
              transparent
            );

          transform: skewX(-20deg);

          transition:
            left 0.65s ease;

          z-index: -1;
        }

        .track-button:hover::before {
          left: 145%;
        }

        .track-button:hover {
          transform: translateY(-2px);

          filter: brightness(1.04);

          box-shadow:
            0 16px 30px
              rgba(37, 99, 235, 0.30);
        }

        .track-button:active {
          transform: translateY(0) scale(0.985);
        }

        .track-button:disabled {
          cursor: not-allowed;

          opacity: 0.7;

          transform: none;
        }


        /* =====================================================
           BUTTON SPINNER
           ===================================================== */

        .track-loading {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;
        }

        .track-spinner {
          width: 16px;
          height: 16px;

          border: 2px solid
            rgba(255, 255, 255, 0.35);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation:
            trackSpin
            0.75s
            linear
            infinite;
        }


        /* =====================================================
           FULL SCREEN SEARCH ANIMATION
           ===================================================== */

        .track-search-animation {
          position: fixed;

          inset: 0;

          z-index: 9999;

          display: flex;

          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at center,
              rgba(37, 99, 235, 0.12),
              transparent 45%
            ),
            rgba(248, 250, 252, 0.97);

          backdrop-filter: blur(12px);

          -webkit-backdrop-filter: blur(12px);

          animation:
            searchOverlayIn
            0.4s
            ease
            both;
        }

        .track-animation-content {
          display: flex;

          flex-direction: column;

          align-items: center;

          text-align: center;

          animation:
            searchContentIn
            0.65s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }


        /* =====================================================
           ANIMATED LOGO
           ===================================================== */

        .track-animation-logo {
          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          width: 110px;
          height: 110px;

          margin-bottom: 30px;

          border-radius: 31px;

          color: #ffffff;

          font-size: 48px;

          background:
            linear-gradient(
              135deg,
              #2563eb 0%,
              #1d4ed8 50%,
              #0ea5e9 100%
            );

          box-shadow:
            0 25px 65px
              rgba(37, 99, 235, 0.30),
            0 12px 30px
              rgba(37, 99, 235, 0.18);

          animation:
            logoFloat
            2.4s
            ease-in-out
            infinite;
        }


        /* Rotating ring */

        .track-animation-logo::before {
          content: "";

          position: absolute;

          inset: -13px;

          border-radius: 38px;

          border: 2px solid transparent;

          border-top-color: #2563eb;

          border-right-color: #38bdf8;

          border-bottom-color: rgba(
            37,
            99,
            235,
            0.15
          );

          animation:
            logoRing
            2.1s
            linear
            infinite;
        }


        /* Glow */

        .track-animation-logo::after {
          content: "";

          position: absolute;

          inset: -27px;

          border-radius: 50px;

          background:
            radial-gradient(
              circle,
              rgba(37, 99, 235, 0.16),
              transparent 68%
            );

          z-index: -1;

          animation:
            logoGlow
            2.3s
            ease-in-out
            infinite;
        }


        /* =====================================================
           ANIMATION TEXT
           ===================================================== */

        .track-animation-title {
          margin: 0;

          color: #0f172a;

          font-size: 1.5rem;

          font-weight: 800;

          letter-spacing: -0.025em;
        }

        .track-animation-subtitle {
          margin: 10px 0 0;

          color: #64748b;

          font-size: 0.9rem;

          font-weight: 500;
        }


        /* =====================================================
           ANIMATED DOTS
           ===================================================== */

        .track-loading-dots {
          display: flex;

          align-items: center;

          gap: 8px;

          margin-top: 24px;
        }

        .track-loading-dots span {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #2563eb;

          animation:
            loadingDot
            1.35s
            infinite
            ease-in-out;
        }

        .track-loading-dots span:nth-child(2) {
          animation-delay: 0.18s;
        }

        .track-loading-dots span:nth-child(3) {
          animation-delay: 0.36s;
        }


        /* =====================================================
           ERROR
           ===================================================== */

        .track-error {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          margin: 0 0 25px;

          padding: 14px 16px;

          color: #b91c1c;

          background:
            linear-gradient(
              135deg,
              #fff7f7,
              #fef2f2
            );

          border: 1px solid #fecaca;

          border-radius: 13px;

          font-size: 0.88rem;

          line-height: 1.5;

          animation:
            trackErrorIn
            0.25s
            ease-out
            both;
        }

        .track-error-icon {
          display: flex;

          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          width: 21px;
          height: 21px;

          margin-top: 1px;

          border-radius: 50%;

          color: #ffffff;

          background: #ef4444;

          font-size: 12px;

          font-weight: 800;
        }


        /* =====================================================
           RESULT CARD
           ===================================================== */

        .track-result-card {
          position: relative;

          overflow: hidden;

          padding: 0;

          background:
            rgba(255, 255, 255, 0.93);

          border: 1px solid #e2e8f0;

          border-radius: 22px;

          box-shadow:
            0 25px 70px
              rgba(15, 23, 42, 0.09),
            0 5px 18px
              rgba(15, 23, 42, 0.04);

          animation:
            trackResultIn
            0.6s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .track-result-card::before {
          content: "";

          position: absolute;

          top: 0;

          left: 0;

          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #38bdf8,
              #2563eb
            );
        }


        /* =====================================================
           DETAIL ROWS
           ===================================================== */

        .track-detail-row {
          display: grid;

          grid-template-columns: 190px 1fr;

          gap: 24px;

          padding: 19px 28px;

          border-bottom: 1px solid #eef2f7;
        }

        .track-detail-row:first-child {
          padding-top: 29px;
        }

        .track-detail-row:last-of-type {
          border-bottom: none;
        }

        .track-detail-label {
          color: #64748b;

          font-size: 0.78rem;

          font-weight: 750;

          text-transform: uppercase;

          letter-spacing: 0.055em;
        }

        .track-detail-value {
          min-width: 0;

          color: #1e293b;

          font-size: 0.94rem;

          line-height: 1.6;

          font-weight: 550;

          overflow-wrap: anywhere;
        }


        /* =====================================================
           COMPLAINT ID
           ===================================================== */

        .track-id-value {
          display: inline-flex;

          align-items: center;

          width: fit-content;

          padding: 6px 10px;

          color: #1d4ed8;

          background: #eff6ff;

          border: 1px solid #dbeafe;

          border-radius: 8px;

          font-family:
            "SFMono-Regular",
            Consolas,
            "Liberation Mono",
            monospace;

          font-size: 0.82rem;

          font-weight: 750;

          letter-spacing: 0.02em;
        }


        /* =====================================================
           PHOTOS
           ===================================================== */

        .track-photo {
          display: block;

          width: min(100%, 430px);

          max-height: 310px;

          object-fit: cover;

          border-radius: 14px;

          border: 1px solid #e2e8f0;

          box-shadow:
            0 10px 25px
              rgba(15, 23, 42, 0.09);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .track-photo:hover {
          transform: translateY(-2px);

          box-shadow:
            0 16px 35px
              rgba(15, 23, 42, 0.13);
        }


        /* =====================================================
           DUPLICATE NOTICE
           ===================================================== */

        .track-duplicate {
          display: flex;

          align-items: flex-start;

          gap: 10px;

          margin: 22px 28px 0;

          padding: 14px 16px;

          color: #075985;

          background:
            linear-gradient(
              135deg,
              #f0f9ff,
              #eff6ff
            );

          border: 1px solid #bae6fd;

          border-radius: 12px;

          font-size: 0.84rem;

          line-height: 1.55;
        }


        /* =====================================================
           TIMELINE
           ===================================================== */

        .track-timeline-section {
          margin: 28px;

          padding: 25px;

          background:
            linear-gradient(
              145deg,
              #f8fafc,
              #f1f5f9
            );

          border: 1px solid #e5eaf0;

          border-radius: 17px;
        }

        .track-timeline-heading {
          display: flex;

          align-items: center;

          gap: 10px;

          margin: 0 0 23px;

          color: #0f172a;

          font-size: 1.05rem;

          font-weight: 800;

          letter-spacing: -0.015em;
        }

        .track-timeline-heading::before {
          content: "";

          width: 4px;
          height: 20px;

          border-radius: 10px;

          background:
            linear-gradient(
              #2563eb,
              #38bdf8
            );
        }


        /* =====================================================
           RATING
           ===================================================== */

        .track-rating-section {
          margin: 0 28px 28px;

          padding: 26px;

          text-align: center;

          background:
            linear-gradient(
              145deg,
              #fffbeb,
              #fff7ed
            );

          border: 1px solid #fde68a;

          border-radius: 17px;
        }

        .track-rating-title {
          margin: 0 0 7px;

          color: #78350f;

          font-size: 1.05rem;

          font-weight: 800;
        }

        .track-rating-subtitle {
          margin: 0 0 18px;

          color: #92400e;

          font-size: 0.85rem;

          line-height: 1.5;
        }


        /* =====================================================
           SUCCESS
           ===================================================== */

        .track-success {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          margin: 22px 28px 28px;

          padding: 15px 17px;

          color: #166534;

          background:
            linear-gradient(
              135deg,
              #f0fdf4,
              #ecfdf5
            );

          border: 1px solid #bbf7d0;

          border-radius: 12px;

          font-size: 0.88rem;

          font-weight: 650;

          text-align: center;
        }

        .track-success-icon {
          display: flex;

          align-items: center;

          justify-content: center;

          width: 21px;
          height: 21px;

          border-radius: 50%;

          color: #ffffff;

          background: #22c55e;

          font-size: 12px;

          font-weight: 900;
        }


        /* =====================================================
           ANIMATIONS
           ===================================================== */

        @keyframes trackFadeDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes trackCardIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes trackResultIn {
          from {
            opacity: 0;
            transform:
              translateY(18px)
              scale(0.99);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes trackErrorIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes trackSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes searchOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes searchContentIn {
          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(0.94);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(0deg);
          }

          50% {
            transform:
              translateY(-8px)
              rotate(1deg);
          }
        }

        @keyframes logoRing {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes logoGlow {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.9);
          }

          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes loadingDot {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }

          30% {
            opacity: 1;
            transform: translateY(-6px);
          }
        }


        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 750px) {

          .track-page {
            padding: 38px 17px 60px;
          }

          .track-form {
            grid-template-columns: 1fr;
          }

          .track-button {
            width: 100%;
          }

          .track-detail-row {
            grid-template-columns: 1fr;
            gap: 6px;
            padding: 17px 20px;
          }

          .track-detail-row:first-child {
            padding-top: 25px;
          }

          .track-timeline-section {
            margin: 22px 20px;
            padding: 20px;
          }

          .track-duplicate {
            margin-left: 20px;
            margin-right: 20px;
          }

          .track-rating-section {
            margin-left: 20px;
            margin-right: 20px;
          }

          .track-success {
            margin-left: 20px;
            margin-right: 20px;
          }
        }


        @media (max-width: 480px) {

          .track-page {
            padding: 28px 12px 45px;
          }

          .track-title {
            font-size: 2.1rem;
          }

          .track-description {
            font-size: 0.9rem;
          }

          .track-search-card {
            padding: 6px;
            border-radius: 15px;
          }

          .track-input {
            height: 52px;
          }

          .track-button {
            height: 52px;
          }

          .track-result-card {
            border-radius: 18px;
          }

          .track-detail-label {
            font-size: 0.72rem;
          }

          .track-detail-value {
            font-size: 0.88rem;
          }

          .track-timeline-section {
            margin: 18px 15px;
            padding: 17px;
          }

          .track-duplicate {
            margin: 18px 15px 0;
          }

          .track-rating-section {
            margin: 18px 15px;
            padding: 20px 15px;
          }

          .track-success {
            margin: 18px 15px;
          }

          .track-photo {
            max-height: 240px;
          }

          .track-animation-logo {
            width: 90px;
            height: 90px;

            border-radius: 26px;

            font-size: 40px;
          }

          .track-animation-logo::before {
            border-radius: 33px;
          }

          .track-animation-title {
            font-size: 1.25rem;
          }

          .track-animation-subtitle {
            font-size: 0.83rem;
          }
        }


        /* =====================================================
           ACCESSIBILITY
           ===================================================== */

        .track-button:focus-visible,
        .track-input:focus-visible {
          outline:
            3px solid
            rgba(37, 99, 235, 0.22);

          outline-offset: 3px;
        }


        @media (prefers-reduced-motion: reduce) {

          .track-page *,
          .track-page *::before,
          .track-page *::after,
          .track-search-animation *,
          .track-search-animation *::before,
          .track-search-animation *::after {
            animation-duration: 0.01ms !important;

            animation-iteration-count: 1 !important;

            transition-duration: 0.01ms !important;
          }
        }

      `}</style>


      {/* =====================================================
          ANIMATED SEARCH SCREEN
          ===================================================== */}

      {loading && (
        <div className="track-search-animation">

          <div className="track-animation-content">

            <div className="track-animation-logo">
              🏛️
            </div>

            <h2 className="track-animation-title">
              Finding Your Complaint
            </h2>

            <p className="track-animation-subtitle">
              Connecting to CivicConnect...
            </p>

            <div className="track-loading-dots">
              <span />
              <span />
              <span />
            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          PAGE
          ===================================================== */}

      <div className="track-page">

        <div className="track-wrapper">

          {/* HEADER */}

          <header className="track-header">

            <div className="track-eyebrow">
              <span className="track-eyebrow-dot" />
              Complaint Tracking
            </div>

            <h1 className="track-title">
              Track Your Complaint
            </h1>

            <p className="track-description">
              Enter your complaint ID to view its current
              status, assigned department, progress, and
              resolution details.
            </p>

          </header>


          {/* SEARCH */}

          <div className="track-search-card">

            <form
              className="track-form"
              onSubmit={handleTrack}
            >

              <div className="track-input-wrapper">

                <span className="track-input-icon">
                  🔎
                </span>

                <input
                  className="track-input"
                  type="text"
                  placeholder="Enter Complaint ID (e.g. CP-2026-0001)"
                  value={complaintId}
                  onChange={(e) =>
                    setComplaintId(e.target.value)
                  }
                  aria-label="Complaint ID"
                />

              </div>

              <button
                type="submit"
                className="track-button"
                disabled={loading}
              >

                {loading ? (
                  <span className="track-loading">

                    <span className="track-spinner" />

                    Searching…

                  </span>
                ) : (
                  'Track Complaint'
                )}

              </button>

            </form>

          </div>


          {/* ERROR */}

          {error && (
            <p className="track-error">

              <span className="track-error-icon">
                !
              </span>

              <span>
                {error}
              </span>

            </p>
          )}


          {/* RESULT */}

          {complaint && (

            <div className="track-result-card">

              {/* Complaint ID */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Complaint ID
                </span>

                <span className="track-detail-value">

                  <span className="track-id-value">
                    {complaint.complaintId}
                  </span>

                </span>

              </div>


              {/* Category */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Category
                </span>

                <span className="track-detail-value">
                  {complaint.category}
                </span>

              </div>


              {/* Description */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Description
                </span>

                <span className="track-detail-value">
                  {complaint.description}
                </span>

              </div>


              {/* Location */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Location
                </span>

                <span className="track-detail-value">

                  {complaint.location.address ||
                    `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`}

                </span>

              </div>


              {/* Complaint Photo */}

              {complaint.photoUrl && (

                <div className="track-detail-row">

                  <span className="track-detail-label">
                    Photo
                  </span>

                  <span className="track-detail-value">

                    <img
                      className="track-photo"
                      src={complaint.photoUrl}
                      alt="Complaint evidence"
                    />

                  </span>

                </div>

              )}


              {/* AI Priority */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  AI Priority
                </span>

                <span className="track-detail-value">

                  <PriorityBadge
                    level={complaint.priority.level}
                  />

                </span>

              </div>


              {/* Department */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Department
                </span>

                <span className="track-detail-value">

                  {complaint.department ||
                    'Not Assigned'}

                </span>

              </div>


              {/* Status */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Current Status
                </span>

                <span className="track-detail-value">

                  <StatusBadge
                    status={complaint.status}
                  />

                </span>

              </div>


              {/* Created */}

              <div className="track-detail-row">

                <span className="track-detail-label">
                  Created
                </span>

                <span className="track-detail-value">

                  {new Date(
                    complaint.createdAt
                  ).toLocaleString()}

                </span>

              </div>


              {/* Resolution Photo */}

              {complaint.resolutionPhotoUrl && (

                <div className="track-detail-row">

                  <span className="track-detail-label">
                    Resolution Photo
                  </span>

                  <span className="track-detail-value">

                    <img
                      className="track-photo"
                      src={complaint.resolutionPhotoUrl}
                      alt="Proof of resolution"
                    />

                  </span>

                </div>

              )}


              {/* Possible Duplicates */}

              {complaint.possibleDuplicates?.length > 0 && (

                <p className="track-duplicate">

                  <span>
                    ℹ️
                  </span>

                  <span>
                    {complaint.possibleDuplicates.length}{' '}
                    similar complaint(s) were already
                    reported nearby when this was submitted.
                  </span>

                </p>

              )}


              {/* PROGRESS */}

              <section className="track-timeline-section">

                <h3 className="track-timeline-heading">
                  Progress
                </h3>

                <ProgressTimeline
                  status={complaint.status}
                />

              </section>


              {/* RATING */}

              {complaint.status === 'RESOLVED' && (

                complaint.rating?.score ? (

                  <p className="track-success">

                    <span className="track-success-icon">
                      ✓
                    </span>

                    <span>
                      You rated this resolution{' '}
                      <strong>
                        {complaint.rating.score}★
                      </strong>
                      . Thank you!
                    </span>

                  </p>

                ) : (

                  <section className="track-rating-section">

                    <h3 className="track-rating-title">
                      How was the resolution?
                    </h3>

                    <p className="track-rating-subtitle">
                      Your feedback helps improve
                      civic services in your community.
                    </p>

                    <StarRating
                      onSubmit={handleRate}
                      submitting={ratingSubmitting}
                    />

                    {ratingMessage && (

                      <p
                        className={
                          ratingMessage.startsWith('Thanks')
                            ? 'track-success'
                            : 'track-error'
                        }
                      >
                        {ratingMessage}
                      </p>

                    )}

                  </section>

                )
              )}

            </div>

          )}

        </div>

      </div>
    </>
  );
}