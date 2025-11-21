import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuthStore } from '../store/auth.js';

export function TrendingTopics() {
  const token = useAuthStore((s) => s.token);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.trendingTopics(token);
        setTopics(res.trendingTopics || []);
      } catch (err) {
        setError(err.message || 'Failed to load trends');
      }
    };
    if (token) load();
  }, [token]);

  return (
    <div className="panel">
      <div className="heading">
        <h3 className="card-title">Trending (human-curated)</h3>
        <span className="badge">Fresh</span>
      </div>
      {error && <div className="alert error">{error}</div>}
      <div className="tag-row" style={{ marginTop: 8 }}>
        {topics.length === 0 ? (
          <div className="muted">No trends yet.</div>
        ) : (
          topics.map((t) => (
            <span key={t.topic} className="badge">
              {t.topic} • {t.count}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
