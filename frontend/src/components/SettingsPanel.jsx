import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function SettingsPanel() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [positivity, setPositivity] = useState(user?.settings?.positivityFilter || false);
  const [topics, setTopics] = useState((user?.settings?.topics || []).join(', '));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = {
        positivityFilter: positivity,
        topics: topics.split(',').map((t) => t.trim()).filter(Boolean)
      };
      const res = await api.updateSettings(token, payload);
      updateUser(res.user);
      setMessage('Preferences saved');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    }
  };

  return (
    <div className="panel">
      <div className="heading">
        <h3 className="card-title">Feed preferences</h3>
        <span className="badge">Custom filters</span>
      </div>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={save} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={positivity}
            onChange={(e) => setPositivity(e.target.checked)}
          />
          <span>Only show positive/constructive threads</span>
        </label>
        <div>
          <div className="label">Topics you want amplified</div>
          <input
            className="input"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="ai, music, sports"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn">Save preferences</button>
        </div>
      </form>
    </div>
  );
}
