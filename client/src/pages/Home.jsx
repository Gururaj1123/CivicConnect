import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard.jsx';
import { getPublicStats } from '../services/api.js';

const STEPS = [
  {
    title: 'Step 1 — Report',
    text: 'Citizen submits a civic issue with description, photo and location.',
  },
  {
    title: 'Step 2 — AI Prioritization',
    text: 'The system analyzes the complaint and assigns a priority.',
  },
  {
    title: 'Step 3 — Authority Action',
    text: 'The responsible department receives and processes the complaint.',
  },
  {
    title: 'Step 4 — Resolution',
    text: 'The citizen can track progress until the complaint is resolved.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'The complaint tracking process is simple and transparent. I could easily see what was happening with my issue.',
    name: 'Citizen Feedback',
    role: 'CivicConnect User',
    initials: 'CF',
  },
  {
    quote:
      'A well-organized platform that makes reporting civic problems much easier than traditional processes.',
    name: 'Community Member',
    role: 'CivicConnect User',
    initials: 'CM',
  },
  {
    quote:
      'Being able to keep the complaint ID and follow the progress gives citizens much more confidence.',
    name: 'Resident',
    role: 'CivicConnect User',
    initials: 'R',
  },
];

export default function Home() {
  const [stats, setStats] = useState({
    total: 1250,
    resolved: 820,
    responseRate: 94,
  });

  useEffect(() => {
    getPublicStats()
      .then((res) => {
        if (res?.success && res?.stats?.total > 0) {
          setStats(res.stats);
        }
      })
      .catch(() => {
        // Keep fallback statistics if API fails.
      });
  }, []);

  return (
    <div className="home-page">

      {/* =====================================================
          GOVERNMENT IDENTITY STRIP
          TOP NAVIGATION REMOVED FROM HOME PAGE
          TO PREVENT DUPLICATE NAVBAR
      ===================================================== */}

      <section className="gov-strip">

        <div className="gov-strip-inner">

          {/* GOVERNMENT BRAND */}
          <div className="gov-left">

            <div className="gov-emblem">
              ✦
            </div>

            <div className="gov-details">

              <div className="gov-hindi">
                भारत सरकार
              </div>

              <div className="gov-title">
                Government of India
              </div>

            </div>

          </div>


          {/* CENTER MESSAGE */}
          <div className="gov-center">
            Citizen Services & Civic Administration
          </div>


          {/* MISSION BHARAT */}
          <div className="mission">

            <div className="mission-logo">
              ✦
            </div>

            <div className="mission-text">
              <strong>MISSION</strong>
              <b>BHARAT</b>
            </div>

          </div>

        </div>


        {/* SMALL TRICOLOR */}
        <div className="gov-tricolor">
          <i></i>
          <i></i>
          <i></i>
        </div>

      </section>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>


        <div className="badge">
          <span></span>
          SMART CIVIC ISSUE MANAGEMENT
        </div>


        <h1>
          Report Civic Issues.
          <br />
          <em>Track Real Progress.</em>
        </h1>


        <p className="hero-description">
          One platform for citizens to report public issues and authorities
          to manage, prioritize and resolve them efficiently.
        </p>


        {/* ACTION BUTTONS */}
        <div className="actions">

          <Link
            to="/report"
            className="primary-btn"
          >
            <span>Report an Issue</span>
            <strong>→</strong>
          </Link>


          <Link
            to="/track"
            className="secondary-btn"
          >
            <span>Track Complaint</span>
            <strong>⌕</strong>
          </Link>

        </div>


        {/* PROCESS FLOW */}
        <div className="flow">

          <div className="flow-item">
            <span>👤</span>

            <div>
              <small>01</small>
              Citizen
            </div>
          </div>


          <b>→</b>


          <div className="flow-item">
            <span>📝</span>

            <div>
              <small>02</small>
              Complaint
            </div>
          </div>


          <b>→</b>


          <div className="flow-item">
            <span>🏛️</span>

            <div>
              <small>03</small>
              Authority
            </div>
          </div>


          <b>→</b>


          <div className="flow-item">
            <span>✓</span>

            <div>
              <small>04</small>
              Resolution
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="section">

        <div className="heading">

          <label>
            HOW IT WORKS
          </label>

          <h2>
            From Complaint to Resolution
          </h2>

          <p>
            A simple and transparent process connecting citizens
            with the right authorities.
          </p>

        </div>


        <div className="steps">

          {STEPS.map((step, index) => (

            <div
              className="step"
              key={step.title}
            >

              <div className="step-number">
                0{index + 1}
              </div>

              <div className="step-line"></div>

              <h3>
                {step.title}
              </h3>

              <p>
                {step.text}
              </p>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="section stats-section">

        <div className="heading">

          <label>
            PLATFORM PERFORMANCE
          </label>

          <h2>
            Civic Impact at a Glance
          </h2>

          <p>
            Real-time insights into reported and resolved civic issues.
          </p>

        </div>


        <div className="stats">

          <div className="stat-wrapper">

            <StatsCard
              label="Issues Reported"
              value={`${stats.total.toLocaleString()}+`}
              tone="primary"
            />

          </div>


          <div className="stat-wrapper">

            <StatsCard
              label="Issues Resolved"
              value={`${stats.resolved.toLocaleString()}+`}
              tone="success"
            />

          </div>


          <div className="stat-wrapper">

            <StatsCard
              label="Response Rate"
              value={`${stats.responseRate}%`}
              tone="warning"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          TRUST / WHY CIVICCONNECT
      ===================================================== */}

      <section className="trust-section">

        <div className="trust-container">

          <div className="trust-heading">

            <label>
              BUILT FOR BETTER CIVIC SERVICES
            </label>

            <h2>
              Designed Around
              <br />
              <span>Transparency & Action.</span>
            </h2>

            <p>
              CivicConnect brings citizens and civic authorities together
              through a structured, transparent and easy-to-use platform.
            </p>

          </div>


          <div className="trust-grid">

            <div className="trust-card">

              <div className="trust-icon blue">
                ✓
              </div>

              <h3>
                Transparent Tracking
              </h3>

              <p>
                Follow the progress of your complaint from submission
                through resolution.
              </p>

            </div>


            <div className="trust-card">

              <div className="trust-icon orange">
                AI
              </div>

              <h3>
                Smart Prioritization
              </h3>

              <p>
                Complaints can be analyzed and prioritized to help
                authorities respond effectively.
              </p>

            </div>


            <div className="trust-card">

              <div className="trust-icon green">
                🏛
              </div>

              <h3>
                Connected Authorities
              </h3>

              <p>
                Issues are directed toward the responsible departments
                for appropriate action.
              </p>

            </div>


            <div className="trust-card">

              <div className="trust-icon purple">
                🔒
              </div>

              <h3>
                Citizen Focused
              </h3>

              <p>
                A simple interface designed to make civic participation
                accessible to everyone.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="section testimonials-section">

        <div className="heading">

          <label>
            CITIZEN EXPERIENCE
          </label>

          <h2>
            What Citizens Say
          </h2>

          <p>
            Feedback from people using CivicConnect to participate
            in improving their communities.
          </p>

        </div>


        <div className="testimonials">

          {TESTIMONIALS.map((testimonial) => (

            <div
              className="testimonial-card"
              key={testimonial.name}
            >

              <div className="quote-mark">
                “
              </div>


              <div className="stars">
                ★ ★ ★ ★ ★
              </div>


              <p className="testimonial-text">
                {testimonial.quote}
              </p>


              <div className="testimonial-person">

                <div className="avatar">
                  {testimonial.initials}
                </div>

                <div>
                  <strong>
                    {testimonial.name}
                  </strong>

                  <span>
                    {testimonial.role}
                  </span>
                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          SUPPORT CTA
      ===================================================== */}

      <section className="support-section">

        <div className="support-card">

          <div className="support-decoration"></div>

          <div className="support-icon">
            ?
          </div>


          <div className="support-content">

            <span>
              NEED ASSISTANCE?
            </span>

            <h2>
              We're here to help.
            </h2>

            <p>
              For support related to your civic complaint or
              using the platform, contact our support team.
            </p>

          </div>


          <a
            href="tel:+917483490512"
            className="support-phone"
          >

            <span className="phone-icon">
              ☎
            </span>

            <span>
              +91 7483 490 512
            </span>

          </a>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-logo">
              ✦
            </div>

            <div>
              <strong>
                CivicConnect
              </strong>

              <span>
                Smart Civic Issue Management
              </span>
            </div>

          </div>


          <div className="footer-links">

            <Link to="/">
              Home
            </Link>

            <Link to="/report">
              Report Issue
            </Link>

            <Link to="/track">
              Track Complaint
            </Link>

            <Link to="/my-complaints">
              My Complaints
            </Link>

          </div>


          <div className="footer-copy">
            © {new Date().getFullYear()} CivicConnect
          </div>

        </div>

      </footer>


      {/* =====================================================
          COMPLETE PAGE STYLING
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        body {
          margin: 0;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        .home-page {
          min-height: 100vh;

          background: #f8fafc;

          color: #0f172a;

          overflow-x: hidden;
        }


        /* =====================================================
           GOVERNMENT IDENTITY STRIP
        ===================================================== */

        .gov-strip {
          position: relative;

          width: 100%;

          background:
            linear-gradient(
              180deg,
              #ffffff,
              #f8fafc
            );

          border-bottom:
            1px solid #e2e8f0;

          box-shadow:
            0 2px 10px
            rgba(15,23,42,.025);

          animation:
            govStripAppear
            .7s
            .15s
            both;
        }


        @keyframes govStripAppear {

          from {
            opacity: 0;

            transform:
              translateY(-5px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }

        }


        .gov-strip-inner {
          max-width: 1250px;

          min-height: 62px;

          margin: 0 auto;

          padding:
            8px 30px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 25px;
        }


        .gov-left {
          display: flex;

          align-items: center;

          gap: 11px;
        }


        .gov-emblem {
          width: 42px;

          height: 46px;

          flex-shrink: 0;

          border:
            1.5px solid #475569;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #1d4ed8;

          font-size: 20px;

          background:
            #fffaf5;
        }


        .gov-details {
          display: flex;

          flex-direction: column;
        }


        .gov-hindi {
          font-size: 10px;

          font-weight: 700;

          color: #334155;
        }


        .gov-title {
          margin-top: 2px;

          font-size: 13px;

          font-weight: 800;

          color: #0f172a;
        }


        .gov-center {
          color:
            #64748b;

          font-size:
            10px;

          font-weight:
            600;

          letter-spacing:
            .3px;

          text-align:
            center;
        }


        .mission {
          display: flex;

          align-items: center;

          gap: 8px;
        }


        .mission-logo {
          width: 36px;

          height: 36px;

          border:
            2px solid #2563eb;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #f59e0b;

          font-size: 16px;

          background:
            #eff6ff;
        }


        .mission-text {
          display: flex;

          flex-direction: column;
        }


        .mission strong,
        .mission b {
          display: block;

          line-height: 1;
        }


        .mission strong {
          color: #2563eb;

          font-size: 7px;

          letter-spacing: 2px;
        }


        .mission b {
          color: #ea580c;

          font-size: 14px;

          margin-top: 3px;
        }


        .gov-tricolor {
          height: 2px;

          display: flex;
        }


        .gov-tricolor i {
          flex: 1;
        }


        .gov-tricolor i:nth-child(1) {
          background: #ff9933;
        }


        .gov-tricolor i:nth-child(2) {
          background: #ffffff;
        }


        .gov-tricolor i:nth-child(3) {
          background: #138808;
        }


        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position: relative;

          max-width: 1150px;

          margin: auto;

          padding:
            95px 25px 78px;

          text-align: center;

          overflow: hidden;
        }


        .hero-glow {
          position: absolute;

          width: 300px;

          height: 300px;

          border-radius: 50%;

          filter:
            blur(80px);

          pointer-events: none;

          opacity: .35;

          animation:
            floatingGlow
            8s ease-in-out infinite;
        }


        .hero-glow-one {
          background:
            rgba(37,99,235,.16);

          top: 50px;

          left: -100px;
        }


        .hero-glow-two {
          background:
            rgba(16,185,129,.12);

          right: -100px;

          top: 180px;

          animation-delay:
            -3s;
        }


        @keyframes floatingGlow {

          0%,
          100% {
            transform:
              translate(0,0);
          }

          50% {
            transform:
              translate(35px,-20px);
          }

        }


        .badge {
          position: relative;

          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding:
            8px 15px;

          border:
            1px solid #dbe3ef;

          border-radius: 30px;

          background:
            rgba(255,255,255,.88);

          color: #475569;

          font-size: 11px;

          font-weight: 800;

          box-shadow:
            0 5px 20px
            rgba(0,0,0,.045);

          animation:
            fadeUp .7s
            .15s both;
        }


        .badge span {
          width: 8px;

          height: 8px;

          background:
            #10b981;

          border-radius: 50%;

          box-shadow:
            0 0 0 5px
            rgba(16,185,129,.09);

          animation:
            pulseDot 2s
            ease-in-out infinite;
        }


        @keyframes pulseDot {

          0%,
          100% {
            transform:
              scale(1);
          }

          50% {
            transform:
              scale(1.25);
          }

        }


        .hero h1 {
          position: relative;

          margin:
            25px auto 0;

          max-width: 900px;

          font-size:
            clamp(2.5rem,6vw,4.5rem);

          line-height:
            1.05;

          letter-spacing:
            -3px;

          font-weight:
            850;

          animation:
            fadeUp .8s
            .25s both;
        }


        .hero h1 em {
          font-style: normal;

          background:
            linear-gradient(
              90deg,
              #2563eb,
              #1d4ed8,
              #059669
            );

          -webkit-background-clip:
            text;

          -webkit-text-fill-color:
            transparent;

          background-size:
            200% auto;

          animation:
            gradientMove
            5s ease infinite;
        }


        @keyframes gradientMove {

          0% {
            background-position:
              0% 50%;
          }

          50% {
            background-position:
              100% 50%;
          }

          100% {
            background-position:
              0% 50%;
          }

        }


        .hero-description {
          position: relative;

          max-width: 700px;

          margin:
            25px auto 0;

          color:
            #64748b;

          font-size: 16px;

          line-height: 1.8;

          animation:
            fadeUp .8s
            .4s both;
        }


        @keyframes fadeUp {

          from {
            opacity: 0;

            transform:
              translateY(20px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }

        }


        .actions {
          position: relative;

          display: flex;

          justify-content: center;

          gap: 14px;

          margin-top: 35px;

          animation:
            fadeUp .8s
            .5s both;
        }


        .primary-btn,
        .secondary-btn {
          position: relative;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          min-width: 170px;

          padding:
            14px 23px;

          border-radius: 11px;

          text-decoration: none;

          font-size: 14px;

          font-weight: 750;

          overflow: hidden;

          transition:
            transform .28s ease,
            box-shadow .28s ease;
        }


        .primary-btn {
          color: white;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );

          box-shadow:
            0 10px 25px
            rgba(37,99,235,.25);
        }


        .primary-btn::before {
          content: "";

          position: absolute;

          top: 0;

          left: -120%;

          width: 70%;

          height: 100%;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.3),
              transparent
            );

          transform:
            skewX(-20deg);

          transition:
            left .6s ease;
        }


        .primary-btn:hover::before {
          left: 140%;
        }


        .primary-btn:hover,
        .secondary-btn:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 16px 30px
            rgba(15,23,42,.12);
        }


        .primary-btn strong,
        .secondary-btn strong {
          transition:
            transform .25s ease;
        }


        .primary-btn:hover strong {
          transform:
            translateX(4px);
        }


        .secondary-btn {
          color:
            #1e293b;

          background:
            white;

          border:
            1px solid #dbe3ef;

          box-shadow:
            0 7px 18px
            rgba(0,0,0,.05);
        }


        .secondary-btn:hover {
          color:
            #1d4ed8;

          border-color:
            #bfdbfe;
        }


        .flow {
          position: relative;

          max-width: 850px;

          margin:
            50px auto 0;

          padding:
            13px;

          display: flex;

          justify-content: center;

          align-items: center;

          gap: 10px;

          flex-wrap: wrap;

          background:
            rgba(255,255,255,.88);

          border:
            1px solid #e2e8f0;

          border-radius: 18px;

          box-shadow:
            0 10px 30px
            rgba(0,0,0,.05);

          backdrop-filter:
            blur(10px);

          animation:
            fadeUp .9s
            .65s both;
        }


        .flow-item {
          display: flex;

          align-items: center;

          gap: 7px;

          padding:
            7px 12px;

          background:
            #f1f5f9;

          border-radius: 30px;

          font-size: 12px;

          font-weight: 700;

          transition:
            transform .25s ease,
            background .25s ease;
        }


        .flow-item:hover {
          transform:
            translateY(-3px);

          background:
            #eff6ff;
        }


        .flow-item > span {
          width: 27px;

          height: 27px;

          background:
            white;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;
        }


        .flow-item div {
          display: flex;

          flex-direction: column;

          align-items: flex-start;
        }


        .flow-item small {
          font-size: 7px;

          color:
            #94a3b8;
        }


        .flow > b {
          color:
            #2563eb;
        }


        /* =====================================================
           GENERAL SECTIONS
        ===================================================== */

        .section {
          max-width: 1200px;

          margin: auto;

          padding:
            80px 25px;
        }


        .heading {
          text-align: center;

          margin-bottom: 42px;
        }


        .heading label {
          color:
            #2563eb;

          font-size: 11px;

          font-weight: 850;

          letter-spacing: 2px;
        }


        .heading h2 {
          margin:
            9px 0;

          font-size: 36px;

          letter-spacing:
            -1.5px;

          color:
            #0f172a;
        }


        .heading p {
          max-width: 600px;

          margin:
            auto;

          color:
            #64748b;

          line-height:
            1.7;

          font-size:
            14px;
        }


        /* =====================================================
           STEPS
        ===================================================== */

        .steps {
          display: grid;

          grid-template-columns:
            repeat(4,1fr);

          gap: 20px;
        }


        .step {
          position: relative;

          padding: 27px;

          min-height: 215px;

          background:
            rgba(255,255,255,.95);

          border:
            1px solid #e2e8f0;

          border-radius: 17px;

          box-shadow:
            0 7px 25px
            rgba(15,23,42,.05);

          transition:
            transform .35s
            cubic-bezier(.22,1,.36,1),
            box-shadow .35s ease,
            border-color .35s ease;

          overflow: hidden;
        }


        .step::before {
          content: "";

          position: absolute;

          left: 0;

          top: 0;

          width: 100%;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              #ff9933,
              #2563eb,
              #138808
            );
        }


        .step:hover {
          transform:
            translateY(-8px);

          border-color:
            #bfdbfe;

          box-shadow:
            0 20px 40px
            rgba(15,23,42,.1);
        }


        .step-number {
          width: 43px;

          height: 43px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 11px;

          background:
            #eff6ff;

          color:
            #2563eb;

          font-weight:
            850;

          margin-bottom:
            18px;

          transition:
            transform .3s ease;
        }


        .step:hover .step-number {
          transform:
            rotate(-5deg)
            scale(1.08);
        }


        .step h3 {
          margin:
            0 0 10px;

          font-size:
            15px;

          color:
            #1e3a8a;
        }


        .step p {
          margin: 0;

          color:
            #64748b;

          font-size:
            13px;

          line-height:
            1.7;
        }


        /* =====================================================
           STATS
        ===================================================== */

        .stats-section {
          padding-top:
            10px;

          padding-bottom:
            95px;
        }


        .stats {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 22px;
        }


        .stat-wrapper {
          transition:
            transform .3s ease;
        }


        .stat-wrapper:hover {
          transform:
            translateY(-6px);
        }


        /* =====================================================
           TRUST
        ===================================================== */

        .trust-section {
          position: relative;

          padding:
            100px 25px;

          background:
            #0f172a;

          overflow: hidden;
        }


        .trust-section::before {
          content: "";

          position: absolute;

          width: 450px;

          height: 450px;

          border-radius: 50%;

          background:
            rgba(37,99,235,.15);

          filter:
            blur(100px);

          top: -200px;

          right: -100px;
        }


        .trust-section::after {
          content: "";

          position: absolute;

          width: 350px;

          height: 350px;

          border-radius: 50%;

          background:
            rgba(16,185,129,.08);

          filter:
            blur(100px);

          bottom: -150px;

          left: -100px;
        }


        .trust-container {
          position: relative;

          z-index: 2;

          max-width:
            1200px;

          margin:
            auto;
        }


        .trust-heading {
          text-align:
            center;

          max-width:
            700px;

          margin:
            0 auto 50px;
        }


        .trust-heading label {
          color:
            #60a5fa;

          font-size:
            11px;

          font-weight:
            800;

          letter-spacing:
            2px;
        }


        .trust-heading h2 {
          margin:
            12px 0;

          color:
            white;

          font-size:
            40px;

          line-height:
            1.15;

          letter-spacing:
            -1.5px;
        }


        .trust-heading h2 span {
          background:
            linear-gradient(
              90deg,
              #60a5fa,
              #34d399
            );

          -webkit-background-clip:
            text;

          -webkit-text-fill-color:
            transparent;
        }


        .trust-heading p {
          color:
            #94a3b8;

          font-size:
            14px;

          line-height:
            1.8;
        }


        .trust-grid {
          display:
            grid;

          grid-template-columns:
            repeat(4,1fr);

          gap:
            18px;
        }


        .trust-card {
          padding:
            25px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius:
            17px;

          background:
            rgba(255,255,255,.045);

          backdrop-filter:
            blur(12px);

          transition:
            transform .3s ease,
            background .3s ease,
            border-color .3s ease;
        }


        .trust-card:hover {
          transform:
            translateY(-7px);

          background:
            rgba(255,255,255,.07);

          border-color:
            rgba(96,165,250,.3);
        }


        .trust-icon {
          width:
            44px;

          height:
            44px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            12px;

          font-size:
            14px;

          font-weight:
            800;

          margin-bottom:
            18px;
        }


        .trust-icon.blue {
          background:
            rgba(59,130,246,.15);

          color:
            #60a5fa;
        }


        .trust-icon.orange {
          background:
            rgba(249,115,22,.15);

          color:
            #fb923c;
        }


        .trust-icon.green {
          background:
            rgba(16,185,129,.15);

          color:
            #34d399;
        }


        .trust-icon.purple {
          background:
            rgba(168,85,247,.15);

          color:
            #c084fc;
        }


        .trust-card h3 {
          color:
            white;

          font-size:
            15px;

          margin:
            0 0 9px;
        }


        .trust-card p {
          color:
            #94a3b8;

          font-size:
            12px;

          line-height:
            1.7;

          margin:
            0;
        }


        /* =====================================================
           TESTIMONIALS
        ===================================================== */

        .testimonials-section {
          padding-top:
            100px;

          padding-bottom:
            100px;
        }


        .testimonials {
          display:
            grid;

          grid-template-columns:
            repeat(3,1fr);

          gap:
            22px;
        }


        .testimonial-card {
          position:
            relative;

          padding:
            30px;

          background:
            white;

          border:
            1px solid #e2e8f0;

          border-radius:
            18px;

          box-shadow:
            0 8px 28px
            rgba(15,23,42,.055);

          overflow:
            hidden;

          transition:
            transform .35s ease,
            box-shadow .35s ease,
            border-color .35s ease;
        }


        .testimonial-card:hover {
          transform:
            translateY(-7px);

          border-color:
            #bfdbfe;

          box-shadow:
            0 20px 40px
            rgba(15,23,42,.1);
        }


        .quote-mark {
          position:
            absolute;

          right:
            24px;

          top:
            12px;

          color:
            #dbeafe;

          font-size:
            70px;

          font-family:
            Georgia,
            serif;

          line-height:
            1;
        }


        .stars {
          color:
            #f59e0b;

          font-size:
            12px;

          letter-spacing:
            2px;

          margin-bottom:
            20px;
        }


        .testimonial-text {
          position:
            relative;

          color:
            #475569;

          font-size:
            14px;

          line-height:
            1.8;

          min-height:
            105px;

          margin:
            0 0 25px;
        }


        .testimonial-person {
          display:
            flex;

          align-items:
            center;

          gap:
            12px;

          padding-top:
            18px;

          border-top:
            1px solid #f1f5f9;
        }


        .avatar {
          width:
            39px;

          height:
            39px;

          border-radius:
            50%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #0ea5e9
            );

          color:
            white;

          font-size:
            10px;

          font-weight:
            800;
        }


        .testimonial-person strong {
          display:
            block;

          color:
            #1e293b;

          font-size:
            12px;
        }


        .testimonial-person span {
          display:
            block;

          color:
            #94a3b8;

          font-size:
            10px;

          margin-top:
            3px;
        }


        /* =====================================================
           SUPPORT
        ===================================================== */

        .support-section {
          padding:
            20px 25px 100px;

          max-width:
            1200px;

          margin:
            auto;
        }


        .support-card {
          position:
            relative;

          display:
            flex;

          align-items:
            center;

          gap:
            24px;

          padding:
            34px 38px;

          border-radius:
            22px;

          color:
            white;

          overflow:
            hidden;

          background:
            linear-gradient(
              135deg,
              #1d4ed8,
              #2563eb 55%,
              #0f766e
            );

          box-shadow:
            0 20px 45px
            rgba(37,99,235,.18);
        }


        .support-decoration {
          position:
            absolute;

          width:
            240px;

          height:
            240px;

          border-radius:
            50%;

          right:
            -70px;

          top:
            -110px;

          background:
            rgba(255,255,255,.08);
        }


        .support-icon {
          position:
            relative;

          width:
            52px;

          height:
            52px;

          flex-shrink:
            0;

          border-radius:
            15px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          color:
            #1d4ed8;

          background:
            white;

          font-size:
            22px;

          font-weight:
            800;

          box-shadow:
            0 8px 20px
            rgba(0,0,0,.12);
        }


        .support-content {
          position:
            relative;

          flex:
            1;
        }


        .support-content > span {
          font-size:
            9px;

          font-weight:
            800;

          letter-spacing:
            2px;

          color:
            #bfdbfe;
        }


        .support-content h2 {
          margin:
            5px 0;

          font-size:
            27px;

          letter-spacing:
            -.6px;
        }


        .support-content p {
          margin:
            0;

          max-width:
            600px;

          color:
            #dbeafe;

          font-size:
            12px;

          line-height:
            1.7;
        }


        .support-phone {
          position:
            relative;

          display:
            inline-flex;

          align-items:
            center;

          gap:
            9px;

          padding:
            13px 17px;

          border:
            1px solid
            rgba(255,255,255,.25);

          border-radius:
            11px;

          color:
            white;

          background:
            rgba(255,255,255,.1);

          text-decoration:
            none;

          font-size:
            13px;

          font-weight:
            750;

          white-space:
            nowrap;

          transition:
            transform .25s ease,
            background .25s ease;
        }


        .support-phone:hover {
          transform:
            translateY(-2px);

          background:
            rgba(255,255,255,.18);
        }


        .phone-icon {
          font-size:
            15px;
        }


        /* =====================================================
           FOOTER
        ===================================================== */

        .footer {
          background:
            #020617;

          color:
            white;

          border-top:
            1px solid
            rgba(255,255,255,.05);
        }


        .footer-inner {
          max-width:
            1200px;

          margin:
            auto;

          padding:
            32px 25px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            25px;
        }


        .footer-brand {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;
        }


        .footer-logo {
          width:
            35px;

          height:
            35px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

          background:
            #2563eb;

          color:
            white;
        }


        .footer-brand strong {
          display:
            block;

          font-size:
            13px;
        }


        .footer-brand span {
          display:
            block;

          color:
            #64748b;

          font-size:
            8px;

          margin-top:
            3px;
        }


        .footer-links {
          display:
            flex;

          gap:
            18px;
        }


        .footer-links a {
          color:
            #94a3b8;

          text-decoration:
            none;

          font-size:
            10px;

          transition:
            color .2s ease;
        }


        .footer-links a:hover {
          color:
            white;
        }


        .footer-copy {
          color:
            #64748b;

          font-size:
            9px;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1000px) {

          .gov-strip-inner {
            padding:
              8px 20px;
          }


          .gov-center {
            font-size:
              9px;
          }


          .steps {
            grid-template-columns:
              repeat(2,1fr);
          }


          .trust-grid {
            grid-template-columns:
              repeat(2,1fr);
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 760px) {

          /* GOVERNMENT STRIP */

          .gov-strip-inner {
            min-height:
              55px;

            padding:
              7px 15px;

            gap:
              10px;
          }


          .gov-left {
            gap:
              8px;
          }


          .gov-emblem {
            width:
              35px;

            height:
              39px;

            font-size:
              17px;
          }


          .gov-hindi {
            font-size:
              8px;
          }


          .gov-title {
            font-size:
              10px;
          }


          .gov-center {
            display:
              none;
          }


          .mission {
            margin-left:
              auto;
          }


          .mission-logo {
            width:
              31px;

            height:
              31px;

            font-size:
              13px;
          }


          .mission strong {
            font-size:
              6px;
          }


          .mission b {
            font-size:
              11px;
          }


          /* HERO */

          .hero {
            padding:
              65px 18px 60px;
          }


          .hero h1 {
            font-size:
              2.4rem;

            letter-spacing:
              -1.5px;
          }


          .hero-description {
            font-size:
              14px;
          }


          .actions {
            flex-direction:
              column;

            align-items:
              center;
          }


          .primary-btn,
          .secondary-btn {
            width:
              100%;

            max-width:
              320px;
          }


          .flow {
            border-radius:
              18px;
          }


          .flow > b {
            font-size:
              12px;
          }


          /* SECTIONS */

          .section {
            padding:
              65px 18px;
          }


          .heading h2 {
            font-size:
              29px;
          }


          .steps {
            grid-template-columns:
              1fr;
          }


          .stats {
            grid-template-columns:
              1fr;
          }


          /* TRUST */

          .trust-section {
            padding:
              75px 18px;
          }


          .trust-heading h2 {
            font-size:
              32px;
          }


          .trust-grid {
            grid-template-columns:
              1fr;
          }


          /* TESTIMONIALS */

          .testimonials {
            grid-template-columns:
              1fr;
          }


          .testimonial-text {
            min-height:
              auto;
          }


          /* SUPPORT */

          .support-section {
            padding:
              10px 18px 70px;
          }


          .support-card {
            flex-direction:
              column;

            align-items:
              flex-start;

            padding:
              28px;
          }


          .support-phone {
            width:
              100%;

            justify-content:
              center;
          }


          /* FOOTER */

          .footer-inner {
            flex-direction:
              column;

            text-align:
              center;
          }


          .footer-brand {
            justify-content:
              center;
          }


          .footer-links {
            flex-wrap:
              wrap;

            justify-content:
              center;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          *,

          *::before,

          *::after {
            animation:
              none !important;

            transition:
              none !important;
          }

        }

      `}</style>

    </div>
  );
}