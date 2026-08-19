import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="premium-navbar">

        <div className="navbar-inner">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            to="/"
            className="navbar-brand"
            onClick={closeMobile}
          >

            <div className="brand-icon">
              ✦
            </div>

            <div className="brand-text">

              <strong>
                CivicConnect
              </strong>

              <span>
                Smart Civic Issue Management
              </span>

            </div>

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="premium-nav">

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >

              <span className="nav-icon">
                ⌂
              </span>

              <span>
                Home
              </span>

            </NavLink>


            <NavLink
              to="/report"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >

              <span className="nav-icon">
                ＋
              </span>

              <span>
                Report Issue
              </span>

            </NavLink>


            <NavLink
              to="/track"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >

              <span className="nav-icon">
                ⌕
              </span>

              <span>
                Track Complaint
              </span>

            </NavLink>


            <NavLink
              to="/my-complaints"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >

              <span className="nav-icon">
                ▣
              </span>

              <span>
                My Complaints
              </span>

            </NavLink>

          </nav>


          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div className="navbar-actions">

            <NavLink
              to="/authority/login"
              className="authority-link"
            >
              Authority
            </NavLink>


            <NavLink
              to="/login"
              className="nav-login-btn"
            >

              <span>
                Login
              </span>

              <span className="login-arrow">
                →
              </span>

            </NavLink>


            {/* MOBILE MENU BUTTON */}

            <button
              className={`mobile-menu-btn ${
                mobileOpen ? 'open' : ''
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open navigation"
            >

              <span></span>
              <span></span>
              <span></span>

            </button>

          </div>

        </div>


        {/* =====================================================
            INDIAN TRICOLOR
        ===================================================== */}

        <div className="navbar-tricolor">

          <span></span>
          <span></span>
          <span></span>

        </div>


        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        <div
          className={`mobile-navigation ${
            mobileOpen ? 'show' : ''
          }`}
        >

          <NavLink
            to="/"
            end
            onClick={closeMobile}
            className={({ isActive }) =>
              `mobile-nav-item ${
                isActive ? 'active' : ''
              }`
            }
          >
            <span>⌂</span>
            Home
          </NavLink>


          <NavLink
            to="/report"
            onClick={closeMobile}
            className={({ isActive }) =>
              `mobile-nav-item ${
                isActive ? 'active' : ''
              }`
            }
          >
            <span>＋</span>
            Report Issue
          </NavLink>


          <NavLink
            to="/track"
            onClick={closeMobile}
            className={({ isActive }) =>
              `mobile-nav-item ${
                isActive ? 'active' : ''
              }`
            }
          >
            <span>⌕</span>
            Track Complaint
          </NavLink>


          <NavLink
            to="/my-complaints"
            onClick={closeMobile}
            className={({ isActive }) =>
              `mobile-nav-item ${
                isActive ? 'active' : ''
              }`
            }
          >
            <span>▣</span>
            My Complaints
          </NavLink>


          <NavLink
            to="/authority/login"
            onClick={closeMobile}
            className={({ isActive }) =>
              `mobile-nav-item ${
                isActive ? 'active' : ''
              }`
            }
          >
            <span>🏛</span>
            Authority Login
          </NavLink>

        </div>

      </header>


      {/* =====================================================
          NAVBAR CSS
      ===================================================== */}

      <style>{`

        /* =====================================================
           MAIN NAVBAR
        ===================================================== */

        .premium-navbar {
          position: sticky;
          top: 0;
          z-index: 9999;

          width: 100%;

          background:
            rgba(255, 255, 255, 0.96);

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          border-bottom:
            1px solid rgba(226, 232, 240, .9);

          box-shadow:
            0 5px 25px rgba(15, 23, 42, .055);

          animation:
            navbarAppear .65s
            cubic-bezier(.22,1,.36,1);
        }


        @keyframes navbarAppear {

          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }


        .navbar-inner {

          width: 100%;
          max-width: 1380px;

          min-height: 76px;

          margin: 0 auto;

          padding: 10px 28px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 25px;

        }


        /* =====================================================
           BRAND
        ===================================================== */

        .navbar-brand {

          display: flex;

          align-items: center;

          gap: 11px;

          color: #0f172a;

          text-decoration: none;

          flex-shrink: 0;

          transition:
            transform .3s ease,
            opacity .3s ease;

        }


        .navbar-brand:hover {

          transform:
            translateY(-2px);

          opacity: .94;

        }


        .brand-icon {

          position: relative;

          width: 43px;
          height: 43px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          color: white;

          font-size: 20px;

          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          box-shadow:
            0 8px 22px
            rgba(37,99,235,.24);

          overflow: hidden;

          transition:
            transform .35s
            cubic-bezier(.22,1,.36,1),
            box-shadow .35s ease;

        }


        .brand-icon::before {

          content: "";

          position: absolute;

          width: 90px;
          height: 25px;

          top: -12px;
          left: -100px;

          background:
            rgba(255,255,255,.35);

          transform:
            rotate(-35deg);

          transition:
            left .65s ease;

        }


        .navbar-brand:hover .brand-icon {

          transform:
            rotate(-3deg)
            scale(1.05);

          box-shadow:
            0 12px 28px
            rgba(37,99,235,.32);

        }


        .navbar-brand:hover .brand-icon::before {

          left: 65px;

        }


        .brand-text {

          display: flex;

          flex-direction: column;

          line-height: 1.15;

        }


        .brand-text strong {

          color: #0f172a;

          font-size: 16px;

          font-weight: 850;

          letter-spacing: -.4px;

        }


        .brand-text span {

          margin-top: 4px;

          color: #94a3b8;

          font-size: 8px;

          font-weight: 750;

          letter-spacing: .65px;

          text-transform: uppercase;

        }


        /* =====================================================
           DESKTOP NAV
        ===================================================== */

        .premium-nav {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 3px;

          flex: 1;

        }


        .nav-item {

          position: relative;

          display: inline-flex;

          align-items: center;

          gap: 7px;

          min-height: 42px;

          padding: 0 13px;

          border-radius: 10px;

          color: #64748b;

          text-decoration: none;

          font-size: 12px;

          font-weight: 650;

          white-space: nowrap;

          transition:
            color .25s ease,
            transform .25s ease,
            background .25s ease;

        }


        .nav-item::before {

          content: "";

          position: absolute;

          inset: 4px;

          border-radius: 8px;

          background:
            rgba(37,99,235,.06);

          opacity: 0;

          transform:
            scale(.8);

          transition:
            opacity .28s ease,
            transform .28s
            cubic-bezier(.22,1,.36,1);

        }


        .nav-item:hover::before {

          opacity: 1;

          transform:
            scale(1);

        }


        .nav-item:hover {

          color: #1d4ed8;

          transform:
            translateY(-1px);

        }


        .nav-item > span {

          position: relative;

          z-index: 2;

        }


        .nav-icon {

          width: 21px;
          height: 21px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 6px;

          font-size: 13px;

          color: #64748b;

          transition:
            color .25s ease,
            background .25s ease,
            transform .3s ease;

        }


        .nav-item:hover .nav-icon {

          color: #2563eb;

          background:
            rgba(37,99,235,.09);

          transform:
            translateY(-1px)
            scale(1.08);

        }


        /* =====================================================
           ACTIVE TAB
        ===================================================== */

        .nav-item.active {

          color: #1d4ed8;

          font-weight: 800;

          background:
            rgba(37,99,235,.055);

          box-shadow:
            inset 0 0 0 1px
            rgba(37,99,235,.05);

        }


        .nav-item.active .nav-icon {

          color: #2563eb;

          background:
            rgba(37,99,235,.1);

        }


        .nav-item::after {

          content: "";

          position: absolute;

          left: 50%;

          bottom: 2px;

          width: 0;

          height: 3px;

          border-radius: 999px;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #0ea5e9
            );

          transform:
            translateX(-50%);

          opacity: 0;

          transition:
            width .35s
            cubic-bezier(.22,1,.36,1),
            opacity .25s ease;

        }


        .nav-item:hover::after {

          width: 45%;

          opacity: 1;

        }


        .nav-item.active::after {

          width: 62%;

          opacity: 1;

          box-shadow:
            0 0 10px
            rgba(37,99,235,.35);

        }


        /* =====================================================
           RIGHT SIDE
        ===================================================== */

        .navbar-actions {

          display: flex;

          align-items: center;

          gap: 10px;

          flex-shrink: 0;

        }


        .authority-link {

          padding: 9px 12px;

          color: #64748b;

          font-size: 11px;

          font-weight: 700;

          text-decoration: none;

          border-radius: 9px;

          transition:
            color .25s ease,
            background .25s ease,
            transform .25s ease;

        }


        .authority-link:hover {

          color: #1d4ed8;

          background:
            rgba(37,99,235,.06);

          transform:
            translateY(-1px);

        }


        /* =====================================================
           LOGIN BUTTON
        ===================================================== */

        .nav-login-btn {

          position: relative;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 8px;

          min-width: 88px;

          height: 40px;

          padding: 0 15px;

          border-radius: 10px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          text-decoration: none;

          font-size: 11px;

          font-weight: 800;

          overflow: hidden;

          box-shadow:
            0 8px 20px
            rgba(37,99,235,.22);

          transition:
            transform .28s ease,
            box-shadow .28s ease;

        }


        .nav-login-btn:hover {

          transform:
            translateY(-2px);

          box-shadow:
            0 13px 30px
            rgba(37,99,235,.3);

        }


        .nav-login-btn:active {

          transform:
            scale(.97);

        }


        .nav-login-btn::before {

          content: "";

          position: absolute;

          top: 0;

          left: -130%;

          width: 75%;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.35),
              transparent
            );

          transform:
            skewX(-20deg);

          transition:
            left .65s ease;

        }


        .nav-login-btn:hover::before {

          left: 140%;

        }


        .nav-login-btn span {

          position: relative;

          z-index: 2;

        }


        .login-arrow {

          font-size: 14px;

          transition:
            transform .25s ease;

        }


        .nav-login-btn:hover .login-arrow {

          transform:
            translateX(4px);

        }


        /* =====================================================
           TRICOLOR
        ===================================================== */

        .navbar-tricolor {

          height: 3px;

          width: 100%;

          display: flex;

          overflow: hidden;

        }


        .navbar-tricolor span {

          flex: 1;

        }


        .navbar-tricolor span:nth-child(1) {

          background: #ff9933;

        }


        .navbar-tricolor span:nth-child(2) {

          background: #ffffff;

        }


        .navbar-tricolor span:nth-child(3) {

          background: #138808;

        }


        /* =====================================================
           MOBILE BUTTON
        ===================================================== */

        .mobile-menu-btn {

          display: none;

          width: 40px;

          height: 40px;

          border: 0;

          border-radius: 10px;

          background:
            #eff6ff;

          cursor: pointer;

          align-items: center;

          justify-content: center;

          flex-direction: column;

          gap: 5px;

        }


        .mobile-menu-btn span {

          width: 19px;

          height: 2px;

          border-radius: 10px;

          background:
            #2563eb;

          transition:
            transform .3s ease,
            opacity .3s ease;

        }


        .mobile-menu-btn.open span:nth-child(1) {

          transform:
            translateY(7px)
            rotate(45deg);

        }


        .mobile-menu-btn.open span:nth-child(2) {

          opacity: 0;

        }


        .mobile-menu-btn.open span:nth-child(3) {

          transform:
            translateY(-7px)
            rotate(-45deg);

        }


        /* =====================================================
           MOBILE NAVIGATION
        ===================================================== */

        .mobile-navigation {

          display: none;

          max-height: 0;

          overflow: hidden;

          opacity: 0;

          transform:
            translateY(-10px);

          transition:
            max-height .4s ease,
            opacity .3s ease,
            transform .4s
            cubic-bezier(.22,1,.36,1);

          border-top:
            1px solid
            rgba(226,232,240,.8);

          background:
            rgba(255,255,255,.98);

        }


        .mobile-navigation.show {

          max-height: 400px;

          opacity: 1;

          transform:
            translateY(0);

        }


        .mobile-nav-item {

          display: flex;

          align-items: center;

          gap: 12px;

          margin: 7px 13px;

          padding: 13px 15px;

          border-radius: 11px;

          color: #64748b;

          text-decoration: none;

          font-size: 13px;

          font-weight: 700;

          transition:
            color .25s ease,
            background .25s ease,
            transform .25s ease;

        }


        .mobile-nav-item:hover {

          color: #2563eb;

          background:
            #eff6ff;

          transform:
            translateX(4px);

        }


        .mobile-nav-item.active {

          color: #1d4ed8;

          background:
            #eff6ff;

        }


        .mobile-nav-item span {

          width: 25px;

          height: 25px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          background:
            rgba(37,99,235,.08);

        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1050px) {

          .navbar-inner {

            padding:
              9px 18px;

            gap: 12px;

          }


          .brand-text span {

            display: none;

          }


          .premium-nav {

            gap: 0;

          }


          .nav-item {

            padding:
              0 8px;

          }


          .nav-item span:last-child {

            font-size: 11px;

          }


          .authority-link {

            display: none;

          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 760px) {

          .navbar-inner {

            min-height:
              68px;

            padding:
              8px 13px;

          }


          .brand-icon {

            width:
              38px;

            height:
              38px;

            font-size:
              17px;

          }


          .brand-text strong {

            font-size:
              14px;

          }


          .premium-nav {

            display:
              none;

          }


          .navbar-actions {

            margin-left:
              auto;

          }


          .nav-login-btn {

            min-width:
              76px;

            height:
              37px;

          }


          .mobile-menu-btn {

            display:
              flex;

          }


          .mobile-navigation {

            display:
              block;

          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .premium-navbar,
          .premium-navbar *,
          .mobile-navigation {

            animation:
              none !important;

            transition:
              none !important;

          }

        }

      `}</style>
    </>
  );
}