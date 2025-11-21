import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function VerificationStatus() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [status, setStatus] = useState(user?.verificationStatus || 'unverified');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      const res = await api.verificationStatus(token);
      setStatus(res.status);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const submitVerification = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const fakeToken = `recaptcha-${Date.now()}`;
      const res = await api.requestVerification(token, {
        recaptchaToken: fakeToken,
        note: 'Simulated verification from web client'
      });
      setMessage(res.message);
      setStatus(res.status);
    } catch (err) {
      setError(err.message || 'Failed to submit verification');
    } finally {
      setLoading(false);
    }
  };

  const confirmSelfie = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.confirmVerification(token, { selfieConfirmed: true });
      setMessage(res.message);
      updateUser({ ...user, humanVerified: true, verificationStatus: 'verified' });
      setStatus('verified');
    } catch (err) {
      setError(err.message || 'Failed to confirm verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="heading">
        <h3 className="card-title">Verification</h3>
        <span className="badge">
          {status === 'verified' ? 'Human-Verified' : status}
        </span>
      </div>
      <p className="muted" style={{ marginTop: 4 }}>
        AuthentiNet requires quick proof-of-humanity before you post. Submit a
        recaptcha check and confirm a selfie to unlock posting.
      </p>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn secondary" onClick={submitVerification} disabled={loading}>
          {loading ? 'Submitting…' : 'Submit verification' }
        </button>
        <button className="btn" onClick={confirmSelfie} disabled={loading || status === 'verified'}>
          {status === 'verified' ? 'Verified' : 'Confirm selfie'}
        </button>
      </div>
    </div>
  );
}
