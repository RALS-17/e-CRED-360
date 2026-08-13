import { useState } from 'react';
import type { Provider, ProviderStatus, RequirementItem } from '../data/mockData';
import { STATUS_LABELS } from '../data/mockData';

interface Props {
  provider: Provider;
  onBack: () => void;
  onUpdate: (p: Provider) => void;
}

export default function ProviderDetail({ provider, onBack, onUpdate }: Props) {
  const defaultTab =
    provider.status === 'applicant' ? 'requirements' : 'credentials';
  const [activeTab, setActiveTab] = useState<'requirements' | 'credentials' | 'privileges' | 'history'>(
    defaultTab
  );

  const statusCounts = {
    verified: provider.credentials.filter((c) => c.status === 'verified').length,
    expiring: provider.credentials.filter((c) => c.status === 'expiring').length,
    expired: provider.credentials.filter((c) => c.status === 'expired').length,
    missing: provider.credentials.filter((c) => c.status === 'missing').length,
    pending: provider.credentials.filter((c) => c.status === 'pending').length,
  };

  const requirements = provider.requirements ?? [];
  const reqDone = requirements.filter((r) => r.completed).length;
  const reqTotal = requirements.length;
  const reqRequiredDone = requirements.filter((r) => r.required && r.completed).length;
  const reqRequiredTotal = requirements.filter((r) => r.required).length;
  const canPromote = reqRequiredDone === reqRequiredTotal && reqRequiredTotal > 0;

  const toggleRequirement = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const nextReqs: RequirementItem[] = requirements.map((r) => {
      if (r.id !== id) return r;
      const completed = !r.completed;
      return {
        ...r,
        completed,
        completedAt: completed ? today : undefined,
      };
    });
    onUpdate({ ...provider, requirements: nextReqs, lastReviewed: today });
  };

  const toggleCredentialChecked = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const credentials = provider.credentials.map((c) =>
      c.id === id ? { ...c, checked: !c.checked } : c
    );
    onUpdate({ ...provider, credentials, lastReviewed: today });
  };

  const promoteTo = (status: ProviderStatus) => {
    if (!canPromote) return;
    const today = new Date().toISOString().slice(0, 10);
    onUpdate({
      ...provider,
      status,
      lastReviewed: today,
      complianceScore: Math.max(provider.complianceScore, status === 'active' ? 70 : 60),
    });
    setActiveTab('credentials');
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        ← Back to Providers
      </button>

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
          <span className={`badge status-${provider.status} large`}>
            {STATUS_LABELS[provider.status]}
          </span>
          <div className="score-big">
            <span className="num">{provider.complianceScore}%</span>
            <span className="lbl">Compliance</span>
          </div>
        </div>
      </div>

      {/* Applicant process panel */}
      {provider.status === 'applicant' && (
        <div className="applicant-process-box">
          <div className="applicant-process-top">
            <div>
              <h3>Applicant process</h3>
              <p>
                Complete all <strong>required</strong> application documents below, then promote to{' '}
                <strong>Active Physician</strong> or <strong>Visiting Physician</strong>.
              </p>
            </div>
            <div className="applicant-progress">
              <span className="applicant-progress-num">
                {reqRequiredDone}/{reqRequiredTotal}
              </span>
              <span className="applicant-progress-lbl">required done</span>
            </div>
          </div>
          <div className="applicant-actions">
            <button
              type="button"
              className="btn primary"
              disabled={!canPromote}
              onClick={() => promoteTo('active')}
              title={canPromote ? 'Promote to Active Physician' : 'Complete required items first'}
            >
              → Active Physician
            </button>
            <button
              type="button"
              className="btn secondary"
              disabled={!canPromote}
              onClick={() => promoteTo('visiting')}
              title={canPromote ? 'Promote to Visiting Physician' : 'Complete required items first'}
            >
              → Visiting Physician
            </button>
            {!canPromote && (
              <span className="muted small">
                Finish all required requirements to unlock promotion.
              </span>
            )}
          </div>
        </div>
      )}

      <div className="status-pills">
        <span className="pill verified">{statusCounts.verified} Verified</span>
        <span className="pill expiring">{statusCounts.expiring} Expiring</span>
        <span className="pill expired">{statusCounts.expired} Expired</span>
        <span className="pill missing">{statusCounts.missing} Missing</span>
        <span className="pill missing">
          Requirements {reqDone}/{reqTotal}
        </span>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'requirements' ? 'active' : ''}
          onClick={() => setActiveTab('requirements')}
        >
          Requirements
        </button>
        <button
          className={activeTab === 'credentials' ? 'active' : ''}
          onClick={() => setActiveTab('credentials')}
        >
          Credentials
        </button>
        <button
          className={activeTab === 'privileges' ? 'active' : ''}
          onClick={() => setActiveTab('privileges')}
        >
          Privileges
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Audit Trail
        </button>
      </div>

      {activeTab === 'requirements' && (
        <div className="checklist-panel">
          <div className="checklist-header">
            <h2>
              Application requirements checklist
              {provider.status === 'applicant' ? ' (Applicant)' : ''}
            </h2>
            <p className="muted">
              Mark each document as received. Required items must be complete before promoting an
              applicant to Active or Visiting Physician.
            </p>
          </div>
          <ul className="checklist">
            {requirements.map((r) => (
              <li key={r.id} className={`checklist-item ${r.completed ? 'done' : ''}`}>
                <label className="checklist-label">
                  <input
                    type="checkbox"
                    checked={r.completed}
                    onChange={() => toggleRequirement(r.id)}
                  />
                  <span className="checklist-text">
                    <span className="checklist-title">
                      {r.label}
                      {r.required && <span className="req-tag">Required</span>}
                    </span>
                    {r.description && <span className="checklist-desc">{r.description}</span>}
                    {r.completedAt && (
                      <span className="checklist-meta">Completed {r.completedAt}</span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'credentials' && (
        <div className="checklist-panel">
          <div className="checklist-header">
            <h2>Credentials checklist</h2>
            <p className="muted">
              Check off each credential when it is on file and verified. Status reflects expiry /
              verification state.
            </p>
          </div>
          <ul className="checklist cred-checklist">
            {provider.credentials.map((c) => (
              <li
                key={c.id}
                className={`checklist-item ${c.checked || c.status === 'verified' ? 'done' : ''}`}
              >
                <label className="checklist-label">
                  <input
                    type="checkbox"
                    checked={!!c.checked}
                    onChange={() => toggleCredentialChecked(c.id)}
                  />
                  <span className="checklist-text">
                    <span className="checklist-title">
                      {c.type}
                      <span className={`badge cred-${c.status}`}>{c.status}</span>
                    </span>
                    <span className="checklist-desc">
                      {c.number ? `No. ${c.number}` : 'No number'} · {c.issuer || '—'}
                      {c.expiryDate ? ` · Exp ${c.expiryDate}` : ''}
                    </span>
                    {c.verifiedAt && (
                      <span className="checklist-meta">Verified {c.verifiedAt}</span>
                    )}
                  </span>
                </label>
                <div className="checklist-actions">
                  {c.status !== 'verified' && (
                    <button type="button" className="btn-sm primary">
                      Verify
                    </button>
                  )}
                  {c.status === 'missing' && (
                    <button type="button" className="btn-sm">
                      Upload
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'privileges' && (
        <div className="table-wrap">
          {provider.privileges.length === 0 ? (
            <div className="empty">
              No privileges granted yet. Complete credential verification first.
            </div>
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
          {provider.status !== 'applicant' && (
            <div className="audit-item">
              <div className="audit-dot success" />
              <div>
                <div className="audit-title">
                  Status: {STATUS_LABELS[provider.status]}
                </div>
                <div className="audit-meta">Credentialing · current</div>
              </div>
            </div>
          )}
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
