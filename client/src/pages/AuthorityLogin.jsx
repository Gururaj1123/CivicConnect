import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authorityLogin } from '../services/api.js';

export default function AuthorityLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authorityLogin(username, password);

    setLoading(false);

    if (result.success) {
      navigate('/authority/dashboard');
    } else {
      setError(result.message);
    }
  }

  return (
    <>
      <style>{`
        /* =====================================================
           AUTHORITY CONSOLE LOGIN
           Presentation only
           ===================================================== */

        * {
          box-sizing: border-box;
        }

        .authority-auth-page {
          min-height: 100vh;
          width: 100%;

          display: grid;
          grid-template-columns: 46% 54%;

          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(15, 118, 110, 0.07),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #eef5f4 100%
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
           LEFT AUTHORITY PANEL
           ===================================================== */

        .authority-brand-panel {
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
              rgba(45, 212, 191, 0.18),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 85%,
              rgba(20, 184, 166, 0.18),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              #062c2a 0%,
              #074744 45%,
              #0f766e 100%
            );
        }

        /* Decorative circles */

        .authority-brand-panel::before {
          content: "";

          position: absolute;

          width: 500px;
          height: 500px;

          right: -230px;
          top: -230px;

          border-radius: 50%;

          border: 1px solid rgba(255, 255, 255, 0.10);

          box-shadow:
            0 0 0 55px rgba(255, 255, 255, 0.025),
            0 0 0 110px rgba(255, 255, 255, 0.018),
            0 0 100px rgba(45, 212, 191, 0.15);
        }

        .authority-brand-panel::after {
          content: "";

          position: absolute;

          width: 350px;
          height: 350px;

          left: -180px;
          bottom: -180px;

          border-radius: 50%;

          background: rgba(45, 212, 191, 0.08);

          filter: blur(5px);
        }

        /* Background grid */

        .authority-grid {
          position: absolute;
          inset: 0;

          opacity: 0.035;

          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.8) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.8) 1px,
              transparent 1px
            );

          background-size: 45px 45px;

          pointer-events: none;
        }

        /* Brand content */

        .authority-brand-content {
          position: relative;
          z-index: 3;

          width: min(510px, 100%);

          animation:
            authorityBrandIn
            0.8s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        /* Icon */

        .authority-brand-icon {
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
              rgba(255, 255, 255, 0.05)
            );

          border: 1px solid rgba(255, 255, 255, 0.18);

          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);

          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);

          animation:
            authorityFloat
            4s
            ease-in-out
            infinite;
        }

        .authority-brand-icon::after {
          content: "";

          position: absolute;
          inset: -7px;

          border-radius: 27px;

          border: 1px solid rgba(94, 234, 212, 0.15);

          pointer-events: none;
        }

        /* Title */

        .authority-brand-content h2 {
          margin: 0 0 20px;

          font-size: clamp(
            2.7rem,
            5vw,
            4.4rem
          );

          line-height: 0.98;

          letter-spacing: -0.055em;

          font-weight: 850;

          color: #ffffff;
        }

        .authority-highlight {
          background:
            linear-gradient(
              135deg,
              #ffffff 15%,
              #ccfbf1 55%,
              #5eead4 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          -webkit-text-fill-color: transparent;
        }

        .authority-brand-content p {
          max-width: 470px;

          margin: 0;

          color: rgba(226, 232, 240, 0.83);

          font-size: 1.08rem;

          line-height: 1.8;

          letter-spacing: 0.005em;
        }

        /* Console status */

        .authority-status {
          display: flex;
          align-items: center;

          gap: 10px;

          margin-top: 34px;

          color: rgba(204, 251, 241, 0.75);

          font-size: 0.82rem;

          font-weight: 600;
        }

        .authority-status-dot {
          width: 8px;
          height: 8px;

          border-radius: 50%;

          background: #2dd4bf;

          box-shadow:
            0 0 0 4px rgba(45, 212, 191, 0.12),
            0 0 17px rgba(45, 212, 191, 0.55);
        }

        /* =====================================================
           RIGHT FORM AREA
           ===================================================== */

        .authority-form-side {
          position: relative;

          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 50px 40px;

          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(20, 184, 166, 0.06),
              transparent 30%
            ),
            rgba(255, 255, 255, 0.55);
        }

        .authority-form-side::before {
          content: "";

          position: absolute;

          width: 250px;
          height: 250px;

          left: -120px;
          top: 15%;

          border-radius: 50%;

          background: rgba(45, 212, 191, 0.06);

          filter: blur(5px);
        }

        /* =====================================================
           FORM CARD
           ===================================================== */

        .authority-form-inner {
          position: relative;
          z-index: 2;

          width: min(475px, 100%);

          padding: 48px;

          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.96),
              rgba(248, 250, 252, 0.91)
            );

          border: 1px solid rgba(255, 255, 255, 0.92);

          border-radius: 28px;

          box-shadow:
            0 35px 90px rgba(15, 23, 42, 0.11),
            0 10px 30px rgba(15, 23, 42, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 1);

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          animation:
            authorityFormIn
            0.75s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        /* Top accent */

        .authority-form-inner::before {
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
              #0f766e,
              #2dd4bf,
              #0f766e
            );

          opacity: 0.9;
        }

        /* =====================================================
           HEADER
           ===================================================== */

        .authority-form-header {
          margin-bottom: 32px;
        }

        .authority-form-title {
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

        .authority-form-subtitle {
          margin: 14px 0 0;

          color: #64748b;

          font-size: 0.96rem;

          line-height: 1.7;
        }

        /* =====================================================
           FORM
           ===================================================== */

        .authority-auth-form {
          display: flex;
          flex-direction: column;

          gap: 20px;
        }

        .authority-form-group {
          display: flex;
          flex-direction: column;

          gap: 8px;
        }

        .authority-field-label {
          color: #334155;

          font-size: 0.86rem;

          font-weight: 700;
        }

        /* =====================================================
           INPUT
           ===================================================== */

        .authority-input {
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

        .authority-input::placeholder {
          color: #a3afbf;
        }

        .authority-input:hover {
          background: #ffffff;

          border-color: #c4d0df;
        }

        .authority-input:focus {
          background: #ffffff;

          border-color: #0f766e;

          transform: translateY(-1px);

          box-shadow:
            0 0 0 4px rgba(15, 118, 110, 0.10),
            0 8px 20px rgba(15, 118, 110, 0.06);
        }

        /* =====================================================
           ERROR
           ===================================================== */

        .authority-error {
          display: flex;
          align-items: flex-start;

          gap: 10px;

          margin: -2px 0 0;

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
            authorityErrorIn
            0.25s
            ease-out
            both;
        }

        .authority-error-icon {
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
           LOGIN BUTTON
           ===================================================== */

        .authority-submit-button {
          position: relative;
          isolation: isolate;

          width: 100%;
          height: 55px;

          margin-top: 3px;

          overflow: hidden;

          color: white;

          border: 0;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #0f766e 0%,
              #0d9488 50%,
              #0f766e 100%
            );

          box-shadow:
            0 12px 27px rgba(15, 118, 110, 0.27),
            0 4px 10px rgba(15, 118, 110, 0.13);

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

        /* Button shine */

        .authority-submit-button::before {
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

        .authority-submit-button:hover::before {
          left: 145%;
        }

        .authority-submit-button:hover {
          transform: translateY(-2px);

          filter: brightness(1.04);

          box-shadow:
            0 18px 35px rgba(15, 118, 110, 0.34),
            0 6px 14px rgba(15, 118, 110, 0.17);
        }

        .authority-submit-button:active {
          transform: translateY(0) scale(0.985);

          box-shadow:
            0 7px 16px rgba(15, 118, 110, 0.22);
        }

        .authority-submit-button:disabled {
          opacity: 0.72;

          cursor: not-allowed;

          transform: none;

          filter: none;
        }

        /* =====================================================
           LOADING
           ===================================================== */

        .authority-loading {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;
        }

        .authority-spinner {
          width: 16px;
          height: 16px;

          border: 2px solid rgba(255, 255, 255, 0.35);

          border-top-color: white;

          border-radius: 50%;

          animation:
            authoritySpin
            0.75s
            linear
            infinite;
        }

        /* =====================================================
           DEMO CREDENTIALS
           ===================================================== */

        .authority-demo-box {
          margin-top: 24px;

          padding: 15px 16px;

          background:
            linear-gradient(
              135deg,
              #f0fdfa,
              #ecfeff
            );

          border: 1px solid #ccfbf1;

          border-radius: 12px;
        }

        .authority-demo-title {
          display: flex;
          align-items: center;

          gap: 8px;

          margin: 0 0 6px;

          color: #115e59;

          font-size: 0.8rem;

          font-weight: 800;

          text-transform: uppercase;

          letter-spacing: 0.06em;
        }

        .authority-demo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          width: 19px;
          height: 19px;

          border-radius: 50%;

          color: white;

          background: #0f766e;

          font-size: 11px;
        }

        .authority-demo-text {
          margin: 0;

          color: #475569;

          font-size: 0.86rem;

          line-height: 1.6;
        }

        .authority-demo-text strong {
          color: #0f172a;

          font-weight: 750;
        }

        /* =====================================================
           PROTOTYPE WARNING
           ===================================================== */

        .authority-warning {
          display: flex;
          align-items: flex-start;

          gap: 10px;

          margin: 14px 0 0;

          padding: 12px 14px;

          color: #92400e;

          background:
            linear-gradient(
              135deg,
              #fffbeb,
              #fefce8
            );

          border: 1px solid #fde68a;

          border-radius: 11px;

          font-size: 0.75rem;

          line-height: 1.55;
        }

        .authority-warning-icon {
          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 19px;
          height: 19px;

          margin-top: 1px;

          border-radius: 50%;

          color: #78350f;

          background: #fbbf24;

          font-size: 11px;

          font-weight: 900;
        }

        .authority-warning p {
          margin: 0;
        }

        /* =====================================================
           ANIMATIONS
           ===================================================== */

        @keyframes authorityBrandIn {
          from {
            opacity: 0;
            transform: translateX(-35px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes authorityFormIn {
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

        @keyframes authorityFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes authoritySpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes authorityErrorIn {
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
          .authority-auth-page {
            grid-template-columns: 1fr;

            overflow: auto;
          }

          .authority-brand-panel {
            min-height: 360px;

            padding: 55px 35px;

            align-items: flex-end;
          }

          .authority-brand-content {
            width: min(680px, 100%);
          }

          .authority-brand-content h2 {
            font-size: 3.2rem;
          }

          .authority-form-side {
            min-height: auto;

            padding: 40px 25px 60px;
          }

          .authority-form-inner {
            width: min(520px, 100%);
          }
        }

        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 600px) {
          .authority-brand-panel {
            min-height: 310px;

            padding: 38px 22px;
          }

          .authority-brand-icon {
            width: 62px;
            height: 62px;

            margin-bottom: 20px;

            border-radius: 17px;

            font-size: 28px;
          }

          .authority-brand-content h2 {
            margin-bottom: 14px;

            font-size: 2.4rem;
          }

          .authority-brand-content p {
            font-size: 0.92rem;

            line-height: 1.65;
          }

          .authority-status {
            margin-top: 22px;

            font-size: 0.76rem;
          }

          .authority-form-side {
            padding: 18px 13px 35px;
          }

          .authority-form-inner {
            padding: 31px 22px;

            border-radius: 22px;
          }

          .authority-form-title {
            font-size: 2rem;
          }

          .authority-form-subtitle {
            font-size: 0.89rem;
          }

          .authority-input {
            height: 52px;
          }

          .authority-submit-button {
            height: 53px;
          }
        }

        /* =====================================================
           SMALL PHONES
           ===================================================== */

        @media (max-width: 380px) {
          .authority-brand-panel {
            min-height: 290px;

            padding: 30px 18px;
          }

          .authority-brand-content h2 {
            font-size: 2.15rem;
          }

          .authority-form-inner {
            padding: 27px 18px;
          }

          .authority-form-title {
            font-size: 1.8rem;
          }
        }

        /* =====================================================
           ACCESSIBILITY
           ===================================================== */

        .authority-submit-button:focus-visible,
        .authority-input:focus-visible {
          outline: 3px solid rgba(15, 118, 110, 0.25);

          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .authority-auth-page *,
          .authority-auth-page *::before,
          .authority-auth-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="authority-auth-page">

        {/* ===================================================
            LEFT BRAND PANEL
            =================================================== */}

        <section className="authority-brand-panel">
          <div className="authority-grid" />

          <div className="authority-brand-content">

            <span className="authority-brand-icon">
              🏢
            </span>

            <h2>
              <span className="authority-highlight">
                Authority Console
              </span>
            </h2>

            <p>
              Review incoming complaints, assign departments,
              and track resolution progress across the city.
            </p>

            <div className="authority-status">
              <span className="authority-status-dot" />
              Secure administration portal
            </div>

          </div>
        </section>


        {/* ===================================================
            RIGHT LOGIN PANEL
            =================================================== */}

        <section className="authority-form-side">

          <div className="authority-form-inner">

            {/* HEADER */}

            <div className="authority-form-header">

              <h1 className="authority-form-title">
                Authority Login
              </h1>

              <p className="authority-form-subtitle">
                Sign in to review, assign, and resolve
                citizen complaints.
              </p>

            </div>


            {/* FORM */}

            <form
              className="authority-auth-form"
              onSubmit={handleSubmit}
            >

              {/* USERNAME */}

              <div className="authority-form-group">

                <label
                  className="authority-field-label"
                  htmlFor="username"
                >
                  Username
                </label>

                <input
                  className="authority-input"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="authority-form-group">

                <label
                  className="authority-field-label"
                  htmlFor="password"
                >
                  Password
                </label>

                <input
                  className="authority-input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

              </div>


              {/* ERROR */}

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


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="authority-submit-button"
                disabled={loading}
              >

                {loading ? (
                  <span className="authority-loading">
                    <span className="authority-spinner" />
                    Logging in…
                  </span>
                ) : (
                  'Login'
                )}

              </button>

            </form>


            {/* DEMO CREDENTIALS */}

            <div className="authority-demo-box">

              <p className="authority-demo-title">
                <span className="authority-demo-icon">
                  i
                </span>

                Demo Access
              </p>

              <p className="authority-demo-text">
                Username:{' '}
                <strong>admin</strong>
                {' '} / {' '}
                Password:{' '}
                <strong>admin123</strong>
              </p>

            </div>


            {/* PROTOTYPE WARNING */}

            <div className="authority-warning">

              <span className="authority-warning-icon">
                !
              </span>

              <p>
                This is a prototype login only. Production
                would use hashed passwords, JWT/session auth,
                and role-based access control.
              </p>

            </div>

          </div>

        </section>

      </div>
    </>
  );
}