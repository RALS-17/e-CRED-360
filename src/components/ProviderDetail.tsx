import { useState } from 'react';
import type { Provider, Credential } from '../data/mockData';

interface Props {
  provider: Provider;
  onBack: () => void;
}

export default function ProviderDetail({ provider, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'credentials' | 'privileges' | 'history'>('credentials');

  const statusCounts = {
    verified: provider.credentials.filter((c) => c.status === 'verified').length,
    expiring: provider.credentials.filter((c) => c.status === 'expiring').length,
    expired: provider.credentials.filter((c) => c.status === 'expired').length,
    missing: provider.credentials.filter((c) => c.status === 'missing').length,
    pending: provider.credentials.filter((c) => c.status === 'pending').length,
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Back to Providers</button>

      <div className="detail-header">
        <div className="provider-cell large">
          <span className="avatar-lg">{provider.photoInitials}</span>
          <div>
            <h1>{provider.name}</h1>
            <div className="meta-row">
              <span>{provider.specialty}</span>
              <span className="dot">·</span>
              <span>{provider.department}</span>
              <span className="dot">·</span>
              <span className="mono">PRC {provider.prcNumber}</span>
              {provider.philHealthNumber && (
                <>
                  <span className="dot">·</span>
                  <span className="mono">PhilHealth {provider.philHealthNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="detail-actions">
          <span className={`badge status-${provider.status} large`}>{provider.status}</span>
          <div className="score-big">
            <span className="num">{provider.complianceScore}%</span>
            <span className="lbl">Compliance</span>
          </div>
        </div>
      </div>

      <div className="status-pills">
        <span className="pill verified">{statusCounts.verified} Verified</span>
        <span className="pill expiring">{statusCounts.expiring} Expiring</span>
        <span className="pill expired">{statusCounts.expired} Expired</span>
        <span className="pill missing">{statusCounts.missing} Missing</span>
      </div>

      <div className="tabs">
        <button className={activeTab === 'credentials' ? 'active' : ''} onClick={() => setActiveTab('credentials')}>
          Credentials
        </button>
        <button className={activeTab === 'privileges' ? 'active' : ''} onClick={() => setActiveTab('privileges')}>
          Privileges
        </button>
        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>
          Audit Trail
        </button>
      </div>

      {activeTab === 'credentials' && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Number / ID</th>
                <th>Issuer</th>
                <th>Issued</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {provider.credentials.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium">{c.type}</td>
                  <td className="mono">{c.number || '—'}</td>
                  <td>{c.issuer || '—'}</td>
                  <td>{c.issueDate || '—'}</td>
                  <td className={c.status === 'expired' || c.status === 'expiring' ? 'text-danger' : ''}>
                    {c.expiryDate || '—'}
                  </td>
                  <td>
                    <span className={`badge cred-${c.status}`}>{c.status}</span>
                  </td>
                  <td className="muted small">{c.verifiedAt || '—'}</td>
                  <td>
                    {c.status !== 'verified' && (
                      <button className="btn-sm primary">Verify</button>
                    )}
                    {c.status === 'missing' && (
                      <button className="btn-sm">Upload</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'privileges' && (
        <div className="table-wrap">
          {provider.privileges.length === 0 ? (
            <div className="empty">No privileges granted yet. Complete credential verification first.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Privilege</th>
                  <th>Status</th>
                  <th>Granted</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {provider.privileges.map((pr, i) => (
                  <tr key={i}>
                    <td>{pr.department}</td>
                    <td className="font-medium">{pr.privilege}</td>
                    <td>
                      <span className={`badge priv-${pr.status}`}>{pr.status}</span>
                    </td>
                    <td>{pr.grantedDate || '—'}</td>
                    <td>{pr.expiryDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="audit-list">
          <div className="audit-item">
            <div className="audit-dot" />
            <div>
              <div className="audit-title">File opened for recredentialing review</div>
              <div className="audit-meta">Credentialing Officer · {provider.lastReviewed}</div>
            </div>
          </div>
          <div className="audit-item">
            <div className="audit-dot success" />
            <div>
              <div className="audit-title">PRC license electronically verified</div>
              <div className="audit-meta">System (PRC portal) · earlier</div>
            </div>
          </div>
          <div className="audit-item">
            <div className="audit-dot" />
            <div>
              <div className="audit-title">Initial application received & digitized</div>
              <div className="audit-meta">HR / Credentialing · onboarding</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
