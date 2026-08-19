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
    <div className="split-page">
      <div className="split-panel">
        <div className="split-panel-content">
          <span className="split-panel-icon">🏛️</span>
          <h2>CivicConnect</h2>
          <p>Report civic issues, track their progress, and see them through to resolution — all from one account.</p>
        </div>
      </div>
      <div className="split-form-side">
        <div className="split-form-inner">
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h1>
          <p className="page-subtitle">
            {mode === 'login'
              ? 'Log in to report issues and track every complaint you\u2019ve filed, all in one place.'
              : 'Sign up to report issues and keep every complaint you file organized on your own page.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="field-label" htmlFor="name">Full Name</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label className="field-label" htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="field-label" htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="field-label" htmlFor="phone">Phone <span className="optional-tag">(optional)</span></label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            )}

            {error && <p className="field-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>Don&apos;t have an account? <button type="button" className="btn-link" onClick={() => setMode('signup')}>Sign up</button></>
            ) : (
              <>Already have an account? <button type="button" className="btn-link" onClick={() => setMode('login')}>Log in</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
