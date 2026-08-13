import type { Provider } from '../data/mockData';

interface Props {
  providers: Provider[];
  onSelect: (p: Provider) => void;
}

export default function Alerts({ providers, onSelect }: Props) {
  const alerts: { type: 'expired' | 'expiring' | 'missing'; provider: Provider; credType: string; detail: string }[] = [];

  providers.forEach((p) => {
    p.credentials.forEach((c) => {
      if (c.status === 'expired') {
        alerts.push({ type: 'expired', provider: p, credType: c.type, detail: `Expired ${c.expiryDate}` });
      } else if (c.status === 'expiring') {
        alerts.push({ type: 'expiring', provider: p, credType: c.type, detail: `Expires ${c.expiryDate}` });
      } else if (c.status === 'missing') {
        alerts.push({ type: 'missing', provider: p, credType: c.type, detail: 'Not on file' });
      }
    });
  });

  const sorted = alerts.sort((a, b) => {
    const order = { expired: 0, missing: 1, expiring: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Alerts & Deficiency Tracking</h1>
        <p className="subtitle">Identify expirations and deficiencies — track until corrected</p>
      </div>

      <div className="alert-summary">
        <div className="alert-stat danger">{alerts.filter((a) => a.type === 'expired').length} Expired</div>
        <div className="alert-stat warning">{alerts.filter((a) => a.type === 'expiring').length} Expiring</div>
        <div className="alert-stat muted">{alerts.filter((a) => a.type === 'missing').length} Missing</div>
      </div>

      <div className="alert-list">
        {sorted.map((a, i) => (
          <div key={i} className={`alert-card type-${a.type}`}>
            <div className="alert-body">
              <div className="alert-title">
                {a.credType} — <strong>{a.provider.name}</strong>
              </div>
              <div className="alert-detail">{a.detail} · {a.provider.department}</div>
            </div>
            <button className="btn-sm" onClick={() => onSelect(a.provider)}>
              Open File
            </button>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Tracking Until Corrected</h2>
        <p className="muted">
          Every deficiency stays on this board until the credential is captured, reviewed, and electronically
          verified. The CRED-IT cycle then continues.
        </p>
      </div>
    </div>
  );
}
