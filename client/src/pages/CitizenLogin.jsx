import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { citizenLogin, citizenSignup } from '../services/api.js';

export default function CitizenLogin() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const redirectTo = routerLocation.state?.from || '/my-complaints';

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = mode === 'login'
      ? await citizenLogin(email, password)
      : await citizenSignup(name, email, password, phone);

    setLoading(false);

    if (result.success) {
      navigate(redirectTo);
    } else {
      setError(result.message);
    }
  }

  return (
    <>
      <style>{`
        /* =====================================================
           CIVICCONNECT AUTH PAGE
           Presentation only
           ===================================================== */

        * {
          box-sizing: border-box;
        }

        .civic-auth-page {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 46% 54%;
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(37, 99, 235, 0.08),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #eef4ff 100%
            );
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow: hidden;
        }

        /* =====================================================
           LEFT SIDE
           ===================================================== */

        .civic-brand-panel {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 70px;
          color: white;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 15% 15%,
              rgba(59, 130, 246, 0.28),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 85%,
              rgba(14, 165, 233, 0.20),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              #06142f 0%,
              #0b2554 48%,
              #0e3a7c 100%
            );
        }

        /* Decorative glow */

        .civic-brand-panel::before {
          content: "";
          position: absolute;
          width: 480px;
          height: 480px;
          right: -220px;
          top: -220px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow:
            0 0 0 55px rgba(255, 255, 255, 0.025),
            0 0 0 110px rgba(255, 255, 255, 0.018),
            0 0 100px rgba(59, 130, 246, 0.15);
        }

        .civic-brand-panel::after {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          left: -180px;
          bottom: -180px;
          border-radius: 50%;
          background: rgba(56, 189, 248, 0.09);
          filter: blur(5px);
        }

        /* Grid pattern */

        .civic-grid {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.7) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.7) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          pointer-events: none;
        }

        .civic-brand-content {
          position: relative;
          z-index: 3;
          width: min(500px, 100%);
          animation: civicBrandIn 0.8s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        /* Icon */

        .civic-brand-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 78px;
          height: 78px;
          margin-bottom: 28px;

          border-radius: 22px;

          font-size: 36px;

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.15),
              rgba(255, 255, 255, 0.06)
            );

          border: 1px solid rgba(255, 255, 255, 0.18);

          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);

          animation: civicFloat 4s ease-in-out infinite;
        }

        .civic-brand-icon::after {
          content: "";
          position: absolute;
          inset: -7px;
          border-radius: 27px;
          border: 1px solid rgba(96, 165, 250, 0.15);
          pointer-events: none;
        }

        /* Brand */

        .civic-brand-content h2 {
          margin: 0 0 20px;

          color: #ffffff;

          font-size: clamp(
            2.7rem,
            5vw,
            4.5rem
          );

          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 850;
        }

        .civic-brand-highlight {
          background:
            linear-gradient(
              135deg,
              #ffffff 15%,
              #bfdbfe 55%,
              #7dd3fc 100%
            );

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .civic-brand-content p {
          max-width: 460px;
          margin: 0;

          color: rgba(226, 232, 240, 0.82);

          font-size: 1.08rem;
          line-height: 1.8;
          letter-spacing: 0.005em;
        }

        /* Small brand detail */

        .civic-brand-status {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-top: 34px;

          color: rgba(219, 234, 254, 0.72);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .civic-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow:
            0 0 0 4px rgba(74, 222, 128, 0.12),
            0 0 16px rgba(74, 222, 128, 0.55);
        }

        /* =====================================================
           RIGHT SIDE
           ===================================================== */

        .civic-form-side {
          position: relative;

          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 50px 40px;

          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(59, 130, 246, 0.07),
              transparent 30%
            ),
            rgba(255, 255, 255, 0.52);
        }

        /* Soft background decoration */

        .civic-form-side::before {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          left: -120px;
          top: 15%;
          border-radius: 50%;
          background: rgba(96, 165, 250, 0.07);
          filter: blur(5px);
        }

        .civic-form-inner {
          position: relative;
          z-index: 2;

          width: min(475px, 100%);

          padding: 48px;

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.95),
              rgba(248, 250, 252, 0.90)
            );

          border: 1px solid rgba(255, 255, 255, 0.9);

          border-radius: 28px;

          box-shadow:
            0 35px 90px rgba(15, 23, 42, 0.11),
            0 10px 30px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 1);

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          animation:
            civicFormIn
            0.75s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        /* Top accent */

        .civic-form-inner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 3px;

          border-radius: 0 0 10px 10px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #38bdf8,
              #2563eb
            );

          opacity: 0.85;
        }

        /* =====================================================
           FORM HEADER
           ===================================================== */

        .civic-form-header {
          margin-bottom: 32px;
        }

        .civic-form-title {
          margin: 0;

          color: #0f172a;

          font-size: clamp(
            2rem,
            4vw,
            2.7rem
          );

          line-height: 1.12;

          letter-spacing: -0.045em;

          font-weight: 800;
        }

        .civic-form-subtitle {
          margin: 14px 0 0;

          color: #64748b;

          font-size: 0.96rem;

          line-height: 1.7;
        }

        /* =====================================================
           FORM
           ===================================================== */

        .civic-auth-form {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .civic-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .civic-field-label {
          color: #334155;

          font-size: 0.86rem;

          font-weight: 700;

          letter-spacing: 0.01em;
        }

        .civic-optional {
          color: #94a3b8;
          font-size: 0.76rem;
          font-weight: 500;
        }

        /* =====================================================
           INPUTS
           ===================================================== */

        .civic-input {
          width: 100%;
          height: 54px;

          padding: 0 16px;

          color: #0f172a;

          background: #f8fafc;

          border: 1.5px solid #dbe3ef;

          border-radius: 13px;

          outline: none;

          font-family: inherit;
          font-size: 0.95rem;

          transition:
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease,
            transform 0.22s ease;
        }

        .civic-input::placeholder {
          color: #a3afbf;
        }

        .civic-input:hover {
          background: #ffffff;
          border-color: #c4d0df;
        }

        .civic-input:focus {
          background: #ffffff;

          border-color: #2563eb;

          transform: translateY(-1px);

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.10),
            0 8px 20px rgba(37, 99, 235, 0.06);
        }

        /* =====================================================
           ERROR
           ===================================================== */

        .civic-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;

          margin: 0;
          padding: 12px 14px;

          color: #b91c1c;

          background:
            linear-gradient(
              135deg,
              #fff7f7,
              #fef2f2
            );

          border: 1px solid #fecaca;

          border-radius: 11px;

          font-size: 0.86rem;

          line-height: 1.5;

          animation:
            civicErrorIn
            0.25s
            ease-out
            both;
        }

        .civic-error-icon {
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 20px;
          height: 20px;

          border-radius: 50%;

          color: white;
          background: #ef4444;

          font-size: 12px;
          font-weight: 800;
        }

        /* =====================================================
           PRIMARY BUTTON
           ===================================================== */

        .civic-submit-button {
          position: relative;
          isolation: isolate;

          width: 100%;
          height: 55px;

          margin-top: 5px;

          overflow: hidden;

          color: #ffffff;

          border: 0;
          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #2563eb 0%,
              #1d4ed8 50%,
              #1e40af 100%
            );

          box-shadow:
            0 12px 27px rgba(37, 99, 235, 0.27),
            0 4px 10px rgba(37, 99, 235, 0.13);

          cursor: pointer;

          font-family: inherit;
          font-size: 0.94rem;
          font-weight: 750;
          letter-spacing: 0.01em;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        /* Shine */

        .civic-submit-button::before {
          content: "";

          position: absolute;

          top: 0;
          left: -130%;

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

          transition: left 0.65s ease;

          z-index: -1;
        }

        .civic-submit-button:hover::before {
          left: 145%;
        }

        .civic-submit-button:hover {
          transform: translateY(-2px);

          filter: brightness(1.04);

          box-shadow:
            0 18px 35px rgba(37, 99, 235, 0.34),
            0 6px 14px rgba(37, 99, 235, 0.17);
        }

        .civic-submit-button:active {
          transform: translateY(0) scale(0.985);

          box-shadow:
            0 7px 16px rgba(37, 99, 235, 0.22);
        }

        .civic-submit-button:disabled {
          opacity: 0.72;
          cursor: not-allowed;
          transform: none;
          filter: none;
        }

        /* Loading animation */

        .civic-loading {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .civic-spinner {
          width: 16px;
          height: 16px;

          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;

          border-radius: 50%;

          animation: civicSpin 0.75s linear infinite;
        }

        /* =====================================================
           LOGIN / SIGNUP SWITCH
           ===================================================== */

        .civic-auth-switch {
          margin: 25px 0 0;

          color: #64748b;

          text-align: center;

          font-size: 0.89rem;
        }

        .civic-link-button {
          padding: 0;
          margin-left: 3px;

          color: #2563eb;

          background: transparent;

          border: 0;

          cursor: pointer;

          font: inherit;
          font-weight: 750;

          transition:
            color 0.2s ease,
            text-decoration-color 0.2s ease;
        }

        .civic-link-button:hover {
          color: #1d4ed8;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* =====================================================
           ANIMATIONS
           ===================================================== */

        @keyframes civicBrandIn {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes civicFormIn {
          from {
            opacity: 0;
            transform:
              translateX(35px)
              translateY(12px);
          }

          to {
            opacity: 1;
            transform:
              translateX(0)
              translateY(0);
          }
        }

        @keyframes civicFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes civicSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes civicErrorIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =====================================================
           TABLET
           ===================================================== */

        @media (max-width: 950px) {
          .civic-auth-page {
            grid-template-columns: 1fr;
            overflow: auto;
          }

          .civic-brand-panel {
            min-height: 360px;
            padding: 55px 35px;
            align-items: flex-end;
          }

          .civic-brand-content {
            width: min(680px, 100%);
          }

          .civic-brand-content h2 {
            font-size: 3.2rem;
          }

          .civic-form-side {
            min-height: auto;
            padding: 40px 25px 60px;
          }

          .civic-form-inner {
            width: min(520px, 100%);
          }
        }

        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 600px) {
          .civic-brand-panel {
            min-height: 310px;
            padding: 38px 22px;
          }

          .civic-brand-icon {
            width: 62px;
            height: 62px;
            margin-bottom: 20px;

            border-radius: 17px;

            font-size: 28px;
          }

          .civic-brand-content h2 {
            margin-bottom: 14px;
            font-size: 2.45rem;
          }

          .civic-brand-content p {
            font-size: 0.92rem;
            line-height: 1.65;
          }

          .civic-brand-status {
            margin-top: 22px;
            font-size: 0.76rem;
          }

          .civic-form-side {
            padding: 18px 13px 35px;
          }

          .civic-form-inner {
            padding: 31px 22px;

            border-radius: 22px;
          }

          .civic-form-title {
            font-size: 2rem;
          }

          .civic-form-subtitle {
            font-size: 0.89rem;
          }

          .civic-input {
            height: 52px;
          }

          .civic-submit-button {
            height: 53px;
          }
        }

        /* =====================================================
           SMALL PHONES
           ===================================================== */

        @media (max-width: 380px) {
          .civic-brand-panel {
            min-height: 290px;
            padding: 30px 18px;
          }

          .civic-brand-content h2 {
            font-size: 2.15rem;
          }

          .civic-form-inner {
            padding: 27px 18px;
          }

          .civic-form-title {
            font-size: 1.8rem;
          }
        }

        /* =====================================================
           ACCESSIBILITY
           ===================================================== */

        .civic-submit-button:focus-visible,
        .civic-link-button:focus-visible,
        .civic-input:focus-visible {
          outline: 3px solid rgba(37, 99, 235, 0.28);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .civic-auth-page *,
          .civic-auth-page *::before,
          .civic-auth-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="civic-auth-page">

        {/* ===================================================
            LEFT BRAND SECTION
            =================================================== */}

        <section className="civic-brand-panel">
          <div className="civic-grid" />

          <div className="civic-brand-content">
            <span className="civic-brand-icon">
              🏛️
            </span>

            <h2>
              <span className="civic-brand-highlight">
                CivicConnect
              </span>
            </h2>

            <p>
              Report civic issues, track their progress, and
              see them through to resolution — all from one
              secure account.
            </p>

            <div className="civic-brand-status">
              <span className="civic-status-dot" />
              Your community. Your voice. Your impact.
            </div>
          </div>
        </section>


        {/* ===================================================
            RIGHT AUTH SECTION
            =================================================== */}

        <section className="civic-form-side">
          <div className="civic-form-inner">

            <div className="civic-form-header">
              <h1 className="civic-form-title">
                {mode === 'login'
                  ? 'Welcome Back'
                  : 'Create Your Account'}
              </h1>

              <p className="civic-form-subtitle">
                {mode === 'login'
                  ? 'Log in to report issues and track every complaint you’ve filed, all in one place.'
                  : 'Sign up to report issues and keep every complaint you file organized on your own page.'}
              </p>
            </div>


            <form
              className="civic-auth-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}

              {mode === 'signup' && (
                <div className="civic-form-group">
                  <label
                    className="civic-field-label"
                    htmlFor="name"
                  >
                    Full Name
                  </label>

                  <input
                    className="civic-input"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>
              )}


              {/* EMAIL */}

              <div className="civic-form-group">
                <label
                  className="civic-field-label"
                  htmlFor="email"
                >
                  Email
                </label>

                <input
                  className="civic-input"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>


              {/* PASSWORD */}

              <div className="civic-form-group">
                <label
                  className="civic-field-label"
                  htmlFor="password"
                >
                  Password
                </label>

                <input
                  className="civic-input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  required
                />
              </div>


              {/* PHONE */}

              {mode === 'signup' && (
                <div className="civic-form-group">
                  <label
                    className="civic-field-label"
                    htmlFor="phone"
                  >
                    Phone{' '}
                    <span className="civic-optional">
                      (optional)
                    </span>
                  </label>

                  <input
                    className="civic-input"
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>
              )}


              {/* ERROR */}

              {error && (
                <p className="civic-error">
                  <span className="civic-error-icon">
                    !
                  </span>

                  <span>{error}</span>
                </p>
              )}


              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                className="civic-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="civic-loading">
                    <span className="civic-spinner" />
                    Please wait…
                  </span>
                ) : (
                  mode === 'login'
                    ? 'Log In'
                    : 'Create Account'
                )}
              </button>

            </form>


            {/* =================================================
                LOGIN / SIGNUP SWITCH
                ================================================= */}

            <p className="civic-auth-switch">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    className="civic-link-button"
                    onClick={() =>
                      setMode('signup')
                    }
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="civic-link-button"
                    onClick={() =>
                      setMode('login')
                    }
                  >
                    Log in
                  </button>
                </>
              )}
            </p>

          </div>
        </section>

      </div>
    </>
  );
}