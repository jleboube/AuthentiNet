import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function Feed({ refreshKey }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (topics) params.set('topics', topics);
      if (user?.settings?.positivityFilter) params.set('positivityOnly', 'true');
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await api.feed(token, query);
      setPosts(res.feed || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshKey]);

  return (
    <div className="panel">
      <div className="heading">
        <h3 className="card-title">Human-only feed</h3>
        <div className="tag-row">
          <span className="badge">Chronological</span>
          {user?.settings?.positivityFilter && <span className="badge">Positivity ON</span>}
        </div>
      </div>
      <div className="grid-2" style={{ marginTop: 12 }}>
        <div>
          <div className="label">Topics filter</div>
          <input
            className="input"
            placeholder="ai, sports, music"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button className="btn secondary" onClick={loadFeed} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh feed'}
          </button>
        </div>
      </div>
      {error && <div className="alert error" style={{ marginTop: 10 }}>{error}</div>}
      <div style={{ marginTop: 12 }}>
        {posts.length === 0 && <div className="muted">No posts yet. Be the first human to share.</div>}
        {posts.map((post) => (
          <div key={post._id} className="post">
            <div className="heading">
              <div style={{ fontWeight: 700 }}>{post.content}</div>
              <span className="badge">{post.positivity}</span>
            </div>
            <div className="muted" style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
              {post.community && <span>• {post.community.name}</span>}
            </div>
            {post.topics?.length > 0 && (
              <div className="tag-row" style={{ marginTop: 8 }}>
                {post.topics.map((t) => (
                  <span key={t} className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
