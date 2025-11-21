import { VerificationStatus } from '../components/VerificationStatus.jsx';

export function VerifyPage() {
  return (
    <div className="layout-shell">
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>Prove you're human</h1>
        <p className="muted">
          Submit a quick recaptcha and confirm with a selfie. We keep bots and AI-generated content out so
          communities stay authentic.
        </p>
      </div>
      <VerificationStatus />
    </div>
  );
}
