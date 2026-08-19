import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthorityLoggedIn, authorityLogout, isCitizenLoggedIn, citizenLogout, getCitizenName } from '../services/api.js';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authorityLoggedIn = isAuthorityLoggedIn();
  const citizenLoggedIn = isCitizenLoggedIn();
  const isAuthorityArea = location.pathname.startsWith('/authority');

  function handleAuthorityLogout() {
    authorityLogout();
    navigate('/');
  }

  function handleCitizenLogout() {
    citizenLogout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-dot" />
        CivicConnect
      </Link>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/report">Report Issue</Link>
        <Link to="/track">Track Complaint</Link>

        {citizenLoggedIn ? (
          <>
            <Link to="/my-complaints">My Complaints</Link>
            <button className="btn-link" onClick={handleCitizenLogout}>Log Out ({getCitizenName().split(' ')[0]})</button>
          </>
        ) : (
          <Link to="/login">Login / Sign Up</Link>
        )}

        {isAuthorityArea && authorityLoggedIn ? (
          <button className="btn-link" onClick={handleAuthorityLogout}>Authority Logout</button>
        ) : (
          <Link to="/authority/login">Authority Login</Link>
        )}
      </nav>
    </header>
  );
}
