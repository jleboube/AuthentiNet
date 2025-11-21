import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { VerifyPage } from './pages/VerifyPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { useAuthStore } from './store/auth.js';

function RequireAuth({ children }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const loading = useAuthStore((s) => s.loading);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (loading) {
    return (
      <div className="layout-shell">
        <div className="panel">Loading…</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <LandingPage />} />
        <Route path="/login" element={token ? <Navigate to="/" /> : <AuthPage mode="login" />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <AuthPage mode="register" />} />
        <Route
          path="/verify"
          element={
            <RequireAuth>
              <VerifyPage />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
