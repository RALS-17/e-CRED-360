import { useMemo, useState } from 'react';
import type { Credential, CredentialStatus, Privilege, Provider, ProviderStatus } from '../data/mockData';
import { makeInitials, nextProviderId } from '../lib/storage';

interface Props {
  providers: Provider[];
  search: string;
  onSelect: (p: Provider) => void;
  onAdd: (p: Provider) => void;
}

const DEPARTMENTS = ['Medicine', 'Surgery', 'Pediatrics', 'OB-GYN', 'Anesthesia', 'Emergency', 'ICU', 'Radiology'];
const SPECIALTIES = [
  'Internal Medicine',
  'General Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Anesthesiology',
  'Emergency Medicine',
  'Radiology',
  'Family Medicine',
];
const STATUSES: ProviderStatus[] = ['active', 'pending', 'incomplete', 'suspended'];

export default function ProvidersList({ providers, search, onSelect, onAdd }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return providers.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (deptFilter !== 'all' && p.department !== deptFilter) return false;
      if (specialtyFilter !== 'all' && p.specialty !== specialtyFilter) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.prcNumber.includes(q) &&
        !p.specialty.toLowerCase().includes(q) &&
        !p.department.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [providers, search, statusFilter, deptFilter, specialtyFilter]);

  const hasActiveFilters =
    statusFilter !== 'all' || deptFilter !== 'all' || specialtyFilter !== 'all';

  const clearFilters = () => {
    setStatusFilter('all');
    setDeptFilter('all');
    setSpecialtyFilter('all');
  };

  return (
    <div className="page">
      <div className="page-header dash-header">
        <div>
          <h1>Provider Master List</h1>
          <p className="subtitle">Centralized electronic credentialing database</p>
        </div>
        <div className="filter-inline">
          <select
            className="filter-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Status"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="filter-select-sm"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            aria-label="Department"
          >
            <option value="all">All departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className="filter-select-sm"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            aria-label="Specialty"
          >
            <option value="all">All specialties</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button type="button" className="filter-clear-link" onClick={clearFilters}>
              Clear
            </button>
          )}
          <span className="filter-result-inline">
            {filtered.length} of {providers.length}
          </span>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <span className="result-count">
            {filtered.length} of {providers.length} providers
          </span>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Cards
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Table
            </button>
          </div>
        </div>
        <button className="btn secondary" onClick={() => setShowAdd(true)}>
          + Add Provider
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No providers match your filters.</p>
          {hasActiveFilters && (
            <button className="btn-sm" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="provider-cards">
          {filtered.map((p) => (
            <div key={p.id} className="provider-card" onClick={() => onSelect(p)}>
              <div className="provider-card-top">
                <span className="avatar-sm">{p.photoInitials}</span>
                <div className="provider-card-info">
                  <div className="provider-card-name">{p.name}</div>
                  <div className="provider-card-meta">
                    {p.specialty} · {p.department}
                  </div>
                  <div className="provider-card-meta" style={{ marginTop: 2 }}>
                    PRC {p.prcNumber}
                    {p.philHealthNumber ? ` · PhilHealth ${p.philHealthNumber}` : ''}
                  </div>
                </div>
              </div>
              <div className="provider-card-bottom">
                <span className={`badge status-${p.status}`}>{p.status}</span>
                <div className="provider-card-score">
                  <div
                    className="score-ring"
                    style={{
                      borderColor: scoreColor(p.complianceScore),
                      color: scoreColor(p.complianceScore),
                    }}
                  >
                    {p.complianceScore}
                  </div>
                  <button
                    className="btn-sm primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(p);
                    }}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Specialty</th>
                <th>Department</th>
                <th>PRC #</th>
                <th>Status</th>
                <th>Score</th>
                <th>Last reviewed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="clickable" onClick={() => onSelect(p)}>
                  <td>
                    <div className="provider-cell">
                      <span className="avatar-sm">{p.photoInitials}</span>
                      <div>
                        <div className="name">{p.name}</div>
                        {p.philHealthNumber && (
                          <div className="muted">PhilHealth {p.philHealthNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{p.specialty}</td>
                  <td>{p.department}</td>
                  <td className="mono">{p.prcNumber}</td>
                  <td>
                    <span className={`badge status-${p.status}`}>{p.status}</span>
                  </td>
                  <td>
                    <div className="score-bar">
                      <span
                        style={{
                          fontWeight: 700,
                          color: scoreColor(p.complianceScore),
                          minWidth: 28,
                        }}
                      >
                        {p.complianceScore}
                      </span>
                      <div className="score-fill">
                        <div
                          style={{
                            width: `${p.complianceScore}%`,
                            height: '100%',
                            borderRadius: 3,
                            background: scoreColor(p.complianceScore),
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="muted">{p.lastReviewed}</td>
                  <td>
                    <button
                      className="btn-sm primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(p);
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <AddProviderModal
          providers={providers}
          onClose={() => setShowAdd(false)}
          onSave={(p) => {
            onAdd(p);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 90) return '#0d9488';
  if (score >= 70) return '#d97706';
  return '#dc2626';
}

/* —— Add Provider Modal (localStorage demo) —— */
function credStatusFromDates(issueDate: string, expiryDate: string): CredentialStatus {
  if (!expiryDate) return 'pending';
  const today = new Date();
  const exp = new Date(expiryDate);
  if (exp < today) return 'expired';
  const in90 = new Date();
  in90.setDate(in90.getDate() + 90);
  if (exp <= in90) return 'expiring';
  if (issueDate) return 'verified';
  return 'pending';
}

function AddProviderModal({
  providers,
  onClose,
  onSave,
}: {
  providers: Provider[];
  onClose: () => void;
  onSave: (p: Provider) => void;
}) {
  const [name, setName] = useState('');
  const [prcNumber, setPrcNumber] = useState('');
  const [philHealthNumber, setPhilHealthNumber] = useState('');
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [status, setStatus] = useState<ProviderStatus>('pending');
  const [complianceScore, setComplianceScore] = useState(40);

  // Credential fields
  const [prcIssue, setPrcIssue] = useState('');
  const [prcExpiry, setPrcExpiry] = useState('');
  const [specCertNumber, setSpecCertNumber] = useState('');
  const [specCertIssue, setSpecCertIssue] = useState('');
  const [specCertExpiry, setSpecCertExpiry] = useState('');
  const [philHealthIssue, setPhilHealthIssue] = useState('');
  const [philHealthExpiry, setPhilHealthExpiry] = useState('');
  const [blsNumber, setBlsNumber] = useState('');
  const [blsIssue, setBlsIssue] = useState('');
  const [blsExpiry, setBlsExpiry] = useState('');
  const [malpracticeNumber, setMalpracticeNumber] = useState('');
  const [malpracticeIssue, setMalpracticeIssue] = useState('');
  const [malpracticeExpiry, setMalpracticeExpiry] = useState('');

  // Privilege
  const [privilegeName, setPrivilegeName] = useState('Admit patients');
  const [privilegeStatus, setPrivilegeStatus] = useState<'granted' | 'pending' | 'denied' | 'expired'>('pending');
  const [privilegeGranted, setPrivilegeGranted] = useState('');
  const [privilegeExpiry, setPrivilegeExpiry] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !prcNumber.trim()) {
      setError('Name and PRC number are required.');
      return;
    }
    if (providers.some((p) => p.prcNumber === prcNumber.trim())) {
      setError('A provider with this PRC number already exists.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const ts = Date.now();

    const credentials: Credential[] = [
      {
        id: `c-${ts}-1`,
        type: 'PRC License',
        number: prcNumber.trim(),
        issuer: 'Professional Regulation Commission',
        issueDate: prcIssue,
        expiryDate: prcExpiry,
        status: credStatusFromDates(prcIssue, prcExpiry),
      },
    ];

    if (specCertNumber.trim() || specCertExpiry) {
      credentials.push({
        id: `c-${ts}-2`,
        type: 'Specialty Certificate',
        number: specCertNumber.trim() || '—',
        issuer: 'Specialty Board',
        issueDate: specCertIssue,
        expiryDate: specCertExpiry,
        status: credStatusFromDates(specCertIssue, specCertExpiry),
      });
    }

    if (philHealthNumber.trim() || philHealthExpiry) {
      credentials.push({
        id: `c-${ts}-3`,
        type: 'PhilHealth Accreditation',
        number: philHealthNumber.trim() || '—',
        issuer: 'PhilHealth',
        issueDate: philHealthIssue,
        expiryDate: philHealthExpiry,
        status: credStatusFromDates(philHealthIssue, philHealthExpiry),
      });
    }

    if (blsNumber.trim() || blsExpiry) {
      credentials.push({
        id: `c-${ts}-4`,
        type: 'BLS / ACLS',
        number: blsNumber.trim() || '—',
        issuer: 'American Heart Association',
        issueDate: blsIssue,
        expiryDate: blsExpiry,
        status: credStatusFromDates(blsIssue, blsExpiry),
      });
    }

    if (malpracticeNumber.trim() || malpracticeExpiry) {
      credentials.push({
        id: `c-${ts}-5`,
        type: 'Malpractice Insurance',
        number: malpracticeNumber.trim() || '—',
        issuer: 'Insurer',
        issueDate: malpracticeIssue,
        expiryDate: malpracticeExpiry,
        status: credStatusFromDates(malpracticeIssue, malpracticeExpiry),
      });
    }

    const privileges: Privilege[] = privilegeName.trim()
      ? [
          {
            department,
            privilege: privilegeName.trim(),
            status: privilegeStatus,
            grantedDate: privilegeGranted || undefined,
            expiryDate: privilegeExpiry || undefined,
          },
        ]
      : [];

    const score = Math.min(100, Math.max(0, Number(complianceScore) || 0));

    const newProvider: Provider = {
      id: nextProviderId(providers),
      name: name.trim().startsWith('Dr') ? name.trim() : `Dr. ${name.trim()}`,
      specialty,
      prcNumber: prcNumber.trim(),
      philHealthNumber: philHealthNumber.trim() || undefined,
      status,
      department,
      lastReviewed: today,
      complianceScore: score,
      photoInitials: makeInitials(name.trim()),
      credentials,
      privileges,
    };
    onSave(newProvider);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Add Provider</h2>
            <p className="modal-note">Demo only — saved in this browser (localStorage).</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Section: Identity */}
          <div className="form-section">
            <div className="form-section-title">Provider identity</div>
            <div className="form-grid">
              <div className="form-field span-2">
                <span className="field-label">
                  Full name <span className="req">*</span>
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ana Isabel Mendoza"
                  autoFocus
                />
              </div>
              <div className="form-field">
                <span className="field-label">
                  PRC number <span className="req">*</span>
                </span>
                <input
                  value={prcNumber}
                  onChange={(e) => setPrcNumber(e.target.value)}
                  placeholder="e.g. 0456789"
                />
              </div>
              <div className="form-field">
                <span className="field-label">PhilHealth number</span>
                <input
                  value={philHealthNumber}
                  onChange={(e) => setPhilHealthNumber(e.target.value)}
                  placeholder="12-xxxxxxxxx-x"
                />
              </div>
              <div className="form-field">
                <span className="field-label">Specialty</span>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <span className="field-label">Department</span>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <span className="field-label">Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as ProviderStatus)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <span className="field-label">Compliance score</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={complianceScore}
                  onChange={(e) => setComplianceScore(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Section: Credentials */}
          <div className="form-section">
            <div className="form-section-title">Credentials</div>
            <p className="form-section-hint">
              Same fields shown on the provider credential table. Leave blank if not yet captured.
            </p>

            <div className="cred-block">
              <div className="cred-block-label">PRC License</div>
              <div className="form-grid three-col">
                <label>
                  Issue date
                  <input type="date" value={prcIssue} onChange={(e) => setPrcIssue(e.target.value)} />
                </label>
                <label>
                  Expiry date
                  <input type="date" value={prcExpiry} onChange={(e) => setPrcExpiry(e.target.value)} />
                </label>
                <label className="readonly-field">
                  Number
                  <input value={prcNumber || '—'} disabled />
                </label>
              </div>
            </div>

            <div className="cred-block">
              <div className="cred-block-label">Specialty Certificate</div>
              <div className="form-grid three-col">
                <label>
                  Certificate #
                  <input
                    value={specCertNumber}
                    onChange={(e) => setSpecCertNumber(e.target.value)}
                    placeholder="e.g. IM-2020-100"
                  />
                </label>
                <label>
                  Issue date
                  <input type="date" value={specCertIssue} onChange={(e) => setSpecCertIssue(e.target.value)} />
                </label>
                <label>
                  Expiry date
                  <input type="date" value={specCertExpiry} onChange={(e) => setSpecCertExpiry(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="cred-block">
              <div className="cred-block-label">PhilHealth Accreditation</div>
              <div className="form-grid three-col">
                <label>
                  Issue date
                  <input
                    type="date"
                    value={philHealthIssue}
                    onChange={(e) => setPhilHealthIssue(e.target.value)}
                  />
                </label>
                <label>
                  Expiry date
                  <input
                    type="date"
                    value={philHealthExpiry}
                    onChange={(e) => setPhilHealthExpiry(e.target.value)}
                  />
                </label>
                <label className="readonly-field">
                  Number
                  <input value={philHealthNumber || '—'} disabled />
                </label>
              </div>
            </div>

            <div className="cred-block">
              <div className="cred-block-label">BLS / ACLS</div>
              <div className="form-grid three-col">
                <label>
                  Certificate #
                  <input value={blsNumber} onChange={(e) => setBlsNumber(e.target.value)} placeholder="optional" />
                </label>
                <label>
                  Issue date
                  <input type="date" value={blsIssue} onChange={(e) => setBlsIssue(e.target.value)} />
                </label>
                <label>
                  Expiry date
                  <input type="date" value={blsExpiry} onChange={(e) => setBlsExpiry(e.target.value)} />
                </label>
              </div>
            </div>

            <div className="cred-block">
              <div className="cred-block-label">Malpractice Insurance</div>
              <div className="form-grid three-col">
                <label>
                  Policy #
                  <input
                    value={malpracticeNumber}
                    onChange={(e) => setMalpracticeNumber(e.target.value)}
                    placeholder="optional"
                  />
                </label>
                <label>
                  Issue date
                  <input
                    type="date"
                    value={malpracticeIssue}
                    onChange={(e) => setMalpracticeIssue(e.target.value)}
                  />
                </label>
                <label>
                  Expiry date
                  <input
                    type="date"
                    value={malpracticeExpiry}
                    onChange={(e) => setMalpracticeExpiry(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section: Privilege */}
          <div className="form-section">
            <div className="form-section-title">Initial privilege</div>
            <div className="form-grid">
              <div className="form-field span-2">
                <span className="field-label">Privilege</span>
                <input
                  value={privilegeName}
                  onChange={(e) => setPrivilegeName(e.target.value)}
                  placeholder="e.g. Admit patients"
                />
              </div>
              <div className="form-field">
                <span className="field-label">Status</span>
                <select
                  value={privilegeStatus}
                  onChange={(e) =>
                    setPrivilegeStatus(e.target.value as 'granted' | 'pending' | 'denied' | 'expired')
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="granted">Granted</option>
                  <option value="denied">Denied</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="form-field">
                <span className="field-label">Granted date</span>
                <input
                  type="date"
                  value={privilegeGranted}
                  onChange={(e) => setPrivilegeGranted(e.target.value)}
                />
              </div>
              <div className="form-field">
                <span className="field-label">Expiry date</span>
                <input
                  type="date"
                  value={privilegeExpiry}
                  onChange={(e) => setPrivilegeExpiry(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions sticky-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Save to master list
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
