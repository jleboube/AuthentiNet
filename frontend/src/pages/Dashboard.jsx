import { useState } from 'react';
import { CreatePostPanel } from '../components/CreatePostPanel.jsx';
import { Feed } from '../components/Feed.jsx';
import { TrendingTopics } from '../components/TrendingTopics.jsx';
import { CommunityPanel } from '../components/CommunityPanel.jsx';
import { VerificationStatus } from '../components/VerificationStatus.jsx';

export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="layout-shell">
      <div className="grid-2">
        <VerificationStatus />
        <TrendingTopics />
      </div>
      <CreatePostPanel onCreated={() => setRefreshKey((k) => k + 1)} />
      <Feed refreshKey={refreshKey} />
      <CommunityPanel />
    </div>
  );
}
