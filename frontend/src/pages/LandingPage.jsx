import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="layout-shell">
      <div className="panel" style={{ textAlign: 'left' }}>
        <div className="badge" style={{ marginBottom: 8 }}>Beta • Human-only</div>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Welcome to AuthentiNet</h1>
        <p className="muted" style={{ fontSize: 16 }}>
          A social network where every post is human-verified. No bots, no AI slop—just real people debating AI ethics,
          cheering sports, and sharing music gossip in positivity-first feeds.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <Link className="btn" to="/register">
            Join the beta
          </Link>
          <Link className="btn secondary" to="/login">
            Already have an account?
          </Link>
        </div>
      </div>
      <div className="grid-2">
        <div className="panel">
          <h3 className="card-title">Proof of humanity</h3>
          <p className="muted">Quick verification gates every creator so your feed stays trustworthy.</p>
        </div>
        <div className="panel">
          <h3 className="card-title">Custom feeds</h3>
          <p className="muted">Positivity filters, topic boosts, and chronological order by default.</p>
        </div>
        <div className="panel">
          <h3 className="card-title">Communities</h3>
          <p className="muted">Spaces for AI ethics, sports finals, pop music chatter, and more.</p>
        </div>
        <div className="panel">
          <h3 className="card-title">Premium ready</h3>
          <p className="muted">Ad-free mode and priority verification are planned for the premium tier.</p>
        </div>
      </div>
    </div>
  );
}
