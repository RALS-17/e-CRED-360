import { useMemo, useState, type FormEvent } from 'react';
import type { Credential, Privilege, Provider, ProviderStatus } from '../data/mockData';
import {
  DEPARTMENTS,
  SPECIALTIES,
  STATUS_LABELS,
  makeApplicationRequirements,
} from '../data/mockData';
import { makeInitials, nextProviderId } from '../lib/storage';

interface Props {
  providers: Provider[];
  search: string;
  onSelect: (p: Provider) => void;
  onAdd: (p: Provider) => void;
}

const STATUSES: ProviderStatus[] = ['active', 'visiting', 'applicant'];

export default function ProvidersList({ providers, search, onSelect, onAdd }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'folders' | 'cards' | 'table'>('folders');
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});

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

  const byDepartment = useMemo(() => {
    const map = new Map<string, Provider[]>();
    for (const d of DEPARTMENTS) map.set(d, []);
    for (const p of filtered) {
      const list = map.get(p.department) ?? [];
      list.push(p);
      map.set(p.department, list);
    }
    // Include any unknown depts
    for (const p of filtered) {
      if (!map.has(p.department)) {
        map.set(p.department, [p]);
      }
    }
    return map;
  }, [filtered]);

  const hasActiveFilters =
    statusFilter !== 'all' || deptFilter !== 'all' || specialtyFilter !== 'all';

  const clearFilters = () => {
    setStatusFilter('all');
    setDeptFilter('all');
    setSpecialtyFilter('all');
  };

  const toggleDept = (dept: string) => {
    setCollapsedDepts((prev) => ({ ...prev, [dept]: !prev[dept] }));
  };

  const expandAll = () => setCollapsedDepts({});
  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    for (const d of DEPARTMENTS) next[d] = true;
    setCollapsedDepts(next);
  };

  return (
    <div className="page">
      <div className="page-header dash-header">
        <div>
          <h1>Provider Master List</h1>
          <p className="subtitle">Department folders · Active · Visiting · Applicant</p>
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
                {STATUS_LABELS[s]}
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
              className={`view-toggle-btn ${viewMode === 'folders' ? 'active' : ''}`}
              onClick={() => setViewMode('folders')}
              title="Department folders"
            >
              Folders
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              Cards
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              Table
            </button>
          </div>
          {viewMode === 'folders' && (
            <div className="folder-expand-btns">
              <button type="button" className="btn-sm" onClick={expandAll}>
                Expand all
              </button>
              <button type="button" className="btn-sm" onClick={collapseAll}>
                Collapse all
              </button>
            </div>
          )}
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
      ) : viewMode === 'folders' ? (
        <div className="dept-folders">
          {Array.from(byDepartment.entries())
            .filter(([, list]) => list.length > 0 || deptFilter === 'all')
            .map(([dept, list]) => {
              if (list.length === 0) return null;
              const collapsed = !!collapsedDepts[dept];
              const activeCount = list.filter((p) => p.status === 'active').length;
              const visitingCount = list.filter((p) => p.status === 'visiting').length;
              const applicantCount = list.filter((p) => p.status === 'applicant').length;
              return (
                <div key={dept} className={`dept-folder ${collapsed ? 'collapsed' : ''}`}>
                  <button
                    type="button"
                    className="dept-folder-header"
                    onClick={() => toggleDept(dept)}
                  >
                    <span className="dept-folder-icon">{collapsed ? '▶' : '▼'}</span>
                    <span className="dept-folder-name">{dept}</span>
                    <span className="dept-folder-count">{list.length}</span>
                    <span className="dept-folder-meta">
                      <span className="badge status-active">{activeCount} Active</span>
                      <span className="badge status-visiting">{visitingCount} Visiting</span>
                      <span className="badge status-applicant">{applicantCount} Applicant</span>
                    </span>
                  </button>
                  {!collapsed && (
                    <div className="dept-folder-body">
                      <div className="provider-cards">
                        {list.map((p) => (
                          <ProviderCard key={p.id} p={p} onSelect={onSelect} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="provider-cards">
          {filtered.map((p) => (
            <ProviderCard key={p.id} p={p} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Department</th>
                <th>Specialty</th>
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
                  <td>{p.department}</td>
                  <td>{p.specialty}</td>
                  <td className="mono">{p.prcNumber}</td>
                  <td>
                    <span className={`badge status-${p.status}`}>{STATUS_LABELS[p.status]}</span>
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

function ProviderCard({ p, onSelect }: { p: Provider; onSelect: (p: Provider) => void }) {
  const reqDone = p.requirements.filter((r) => r.completed).length;
  const reqTotal = p.requirements.length;
  return (
    <div className="provider-card" onClick={() => onSelect(p)}>
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
        <span className={`badge status-${p.status}`}>{STATUS_LABELS[p.status]}</span>
        {p.status === 'applicant' && (
          <span className="muted small">
            Req {reqDone}/{reqTotal}
          </span>
        )}
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
  );
}

function scoreColor(score: number) {
  if (score >= 90) return '#0d9488';
  if (score >= 70) return '#d97706';
  return '#dc2626';
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
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [status, setStatus] = useState<ProviderStatus>('applicant');
  const [complianceScore, setComplianceScore] = useState(30);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
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
    const id = nextProviderId(providers);
    const credentials: Credential[] = [
      {
        id: `c-${Date.now()}-1`,
        type: 'PRC License',
        number: prcNumber.trim(),
        issuer: 'Professional Regulation Commission',
        issueDate: '',
        expiryDate: '',
        status: 'pending',
        checked: false,
      },
    ];

    const privileges: Privilege[] = [];
    const score = Math.min(100, Math.max(0, Number(complianceScore) || 0));

    const newProvider: Provider = {
      id,
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
      requirements: makeApplicationRequirements(id.replace(/\D/g, '') || 'new', []),
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
                <span className="field-label">Department folder</span>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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
                <span className="field-label">Status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as ProviderStatus)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
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
