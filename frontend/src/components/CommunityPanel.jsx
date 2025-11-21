import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function CommunityPanel() {
  const token = useAuthStore((s) => s.token);
  const [communities, setCommunities] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', tags: 'ai, sports' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.listCommunities();
      setCommunities(res.communities || []);
    } catch (err) {
      setError(err.message || 'Failed to load communities');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };
      await api.createCommunity(token, payload);
      setMessage('Community created');
      setForm({ name: '', description: '', tags: '' });
      load();
    } catch (err) {
      setError(err.message || 'Failed to create community');
    }
  };

  const join = async (id) => {
    setError('');
    setMessage('');
    try {
      await api.joinCommunity(token, id);
      setMessage('Joined community');
    } catch (err) {
      setError(err.message || 'Failed to join');
    }
  };

  return (
    <div className="panel">
      <div className="heading">
        <h3 className="card-title">Communities</h3>
        <span className="badge">Human curated</span>
      </div>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={create} style={{ display: 'grid', gap: 10, marginTop: 10 }}>
        <div className="grid-2">
          <div>
            <div className="label">Community name</div>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="AI ethics, Sports positivity…"
              required
            />
          </div>
          <div>
            <div className="label">Tags</div>
            <input
              className="input"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="ai, music"
            />
          </div>
        </div>
        <div>
          <div className="label">Description</div>
          <input
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Why this space matters"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" disabled={!token}>Create community</button>
        </div>
      </form>

      <div style={{ marginTop: 16 }}>
        {communities.length === 0 ? (
          <div className="muted">No communities yet. Start one.</div>
        ) : (
          communities.map((c) => (
            <div key={c._id} className="post">
              <div className="heading">
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div className="muted">#{c.slug} • {c.members?.length || 0} humans</div>
                </div>
                {token && (
                  <button className="btn secondary" onClick={() => join(c._id)}>
                    Join
                  </button>
                )}
              </div>
              <div className="muted" style={{ marginTop: 6 }}>{c.description}</div>
              {c.tags?.length > 0 && (
                <div className="tag-row" style={{ marginTop: 8 }}>
                  {c.tags.map((tag) => (
                    <span key={tag} className="badge">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
