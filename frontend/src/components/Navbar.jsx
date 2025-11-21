import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.js';

export function Navbar() {
  const navigate = useNavigate();
  const { user, clear } = useAuthStore();

  const handleLogout = () => {
    clear();
    navigate('/login');
  };

  return (
    <div className="panel navbar">
      <div>
        <Link to="/" style={{ fontWeight: 800, fontSize: 18 }}>
          AuthentiNet
        </Link>
        <div className="muted" style={{ fontSize: 13 }}>
          Human-only feeds crafted for real discourse
        </div>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="badge">
              <span>{user.humanVerified ? 'Human-Verified' : 'Needs Verification'}</span>
            </span>
            <div className="muted" style={{ fontSize: 14 }}>
              @{user.username}
            </div>
            <button className="btn secondary" onClick={() => navigate('/verify')}>
              Verify
            </button>
            <button className="btn secondary" onClick={() => navigate('/')}>Feed</button>
            <button className="btn secondary" onClick={() => navigate('/settings')}>
              Settings
            </button>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn secondary" to="/login">
              Login
            </Link>
            <Link className="btn" to="/register">
              Join the beta
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
