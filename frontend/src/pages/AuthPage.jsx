import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password };
      const data = await (isLogin ? api.login(payload) : api.register(payload));
      setAuth({ token: data.token, user: data.user });
      navigate(data.user.humanVerified ? '/' : '/verify');
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-shell">
      <div className="panel">
        <div className="heading">
          <div>
            <div className="muted" style={{ marginBottom: 4 }}>
              AuthentiNet Beta
            </div>
            <h1 style={{ margin: 0 }}>{isLogin ? 'Log in' : 'Create an account'}</h1>
          </div>
          <Link className="btn secondary" to={isLogin ? '/register' : '/login'}>
            {isLogin ? 'Need an account?' : 'Already joined?'}
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {!isLogin && (
            <div>
              <div className="label">Username</div>
              <input
                className="input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="realhuman42"
                required
              />
            </div>
          )}
          <div>
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <div className="label">Password</div>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>
          {error && <div className="alert error">{error}</div>}
          <button className="btn" disabled={loading} type="submit">
            {loading ? 'Processing…' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
