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
    <div className="split-page">
      <div className="split-panel split-panel-authority">
        <div className="split-panel-content">
          <span className="split-panel-icon">🏢</span>
          <h2>Authority Console</h2>
          <p>Review incoming complaints, assign departments, and track resolution progress across the city.</p>
        </div>
      </div>
      <div className="split-form-side">
        <div className="split-form-inner">
          <h1>Authority Login</h1>
          <p className="page-subtitle">Sign in to review, assign, and resolve citizen complaints.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="field-label" htmlFor="username">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="field-label" htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="field-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <p className="demo-note">Demo credentials: <strong>admin</strong> / <strong>admin123</strong></p>
          <p className="demo-note prototype-warning">This is a prototype login only. Production would use hashed passwords, JWT/session auth, and role-based access control.</p>
        </div>
      </div>
    </div>
  );
}
