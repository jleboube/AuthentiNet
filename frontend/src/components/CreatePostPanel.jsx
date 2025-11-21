import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function CreatePostPanel({ onCreated }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [content, setContent] = useState('');
  const [topics, setTopics] = useState('ai, sports, music');
  const [positivity, setPositivity] = useState('positive');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        content,
        topics: topics.split(',').map((t) => t.trim()).filter(Boolean),
        positivity
      };
      const res = await api.createPost(token, payload);
      setContent('');
      if (onCreated) onCreated(res.post);
    } catch (err) {
      setError(err.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="heading">
        <h3 className="card-title">Create a post</h3>
        <span className="badge">Human-only</span>
      </div>
      {!user?.humanVerified && (
        <div className="alert error">Verify to start contributing.</div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <div className="label">Content</div>
          <textarea
            className="textarea"
            placeholder="Share a take on AI ethics, sports debates, music gossip…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!user?.humanVerified}
            required
          />
        </div>
        <div className="grid-2">
          <div>
            <div className="label">Topics (comma separated)</div>
            <input
              className="input"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              disabled={!user?.humanVerified}
            />
          </div>
          <div>
            <div className="label">Tone preference</div>
            <select
              className="select"
              value={positivity}
              onChange={(e) => setPositivity(e.target.value)}
              disabled={!user?.humanVerified}
            >
              <option value="positive">Positive first</option>
              <option value="neutral">Neutral</option>
              <option value="needs-review">Needs review</option>
            </select>
          </div>
        </div>
        {error && <div className="alert error">{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" disabled={!user?.humanVerified || loading}>
            {loading ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </form>
    </div>
  );
}
