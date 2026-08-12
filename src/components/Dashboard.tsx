import { useMemo, useState } from 'react';
import type { Provider, ProviderStatus } from '../data/mockData';

interface Stats {
  totalProviders: number;
  fullyCompliant: number;
  expiringSoon: number;
  expiredCredentials: number;
  pendingVerification: number;
  averageCompliance: number;
  zeroExpiredCritical: boolean;
}

interface DashboardProps {
  stats: Stats;
  providers: Provider[];
  onSelect: (p: Provider) => void;
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

function computeStats(list: Provider[]) {
  const total = list.length || 1;
  const fullyCompliant = list.filter((p) => p.complianceScore >= 90).length;
  const expiringSoon = list.reduce(
    (n, p) => n + p.credentials.filter((c) => c.status === 'expiring').length,
    0
  );
  const expiredCredentials = list.reduce(
    (n, p) => n + p.credentials.filter((c) => c.status === 'expired').length,
    0
  );
  const pendingVerification = list.filter(
    (p) => p.status === 'pending' || p.status === 'incomplete'
  ).length;
  const averageCompliance =
    list.length === 0
      ? 0
      : Math.round(list.reduce((s, p) => s + p.complianceScore, 0) / list.length);

  return {
    totalProviders: list.length,
    fullyCompliant,
    expiringSoon,
    expiredCredentials,
    pendingVerification,
    averageCompliance,
    zeroExpiredCritical: expiredCredentials === 0,
  };
}

export default function Dashboard({ providers, onSelect }: DashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (deptFilter !== 'all' && p.department !== deptFilter) return false;
      if (specialtyFilter !== 'all' && p.specialty !== specialtyFilter) return false;
      return true;
    });
  }, [providers, statusFilter, deptFilter, specialtyFilter]);

  const stats = useMemo(() => computeStats(filteredProviders), [filteredProviders]);

  const topRisk = filteredProviders
    .filter((p) => p.complianceScore < 90)
    .sort((a, b) => a.complianceScore - b.complianceScore);

  const compliantPct =
    stats.totalProviders === 0
      ? 0
      : Math.round((stats.fullyCompliant / stats.totalProviders) * 100);

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
          <h1>Dashboard</h1>
          <p className="subtitle">Credentialing compliance report & activity</p>
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
            {filteredProviders.length} of {providers.length}
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-purple">
          <div className="kpi-label">Total Providers</div>
          <div className="kpi-value">{stats.totalProviders}</div>
          <div className="kpi-meta">
            {hasActiveFilters ? 'matching filters' : 'in master list'}
          </div>
        </div>
        <div className="kpi-card kpi-blue">
          <div className="kpi-label">Fully Compliant</div>
          <div className="kpi-value">{stats.fullyCompliant}</div>
          <div className="kpi-meta">{compliantPct}% of shown</div>
        </div>
        <div className="kpi-card kpi-orange">
          <div className="kpi-label">Expiring Soon</div>
          <div className="kpi-value">{stats.expiringSoon}</div>
          <div className="kpi-meta">within 90 days</div>
        </div>
        <div className="kpi-card kpi-teal">
          <div className="kpi-label">Avg Score</div>
          <div className="kpi-value">{stats.averageCompliance}%</div>
          <div className="kpi-meta">target 100%</div>
        </div>
      </div>

      {/* Secondary panels */}
      <div className="dash-panels">
        <div className="dash-panel">
          <h3 className="panel-title">Status breakdown</h3>
          <div className="status-list">
            <div className="status-row">
              <span className="status-dot" style={{ background: '#22c55e' }} />
              <span className="status-name">Compliant</span>
              <span className="status-count">{stats.fullyCompliant}</span>
              <span className="status-pct">{compliantPct}%</span>
            </div>
            <div className="status-row">
              <span className="status-dot" style={{ background: '#f59e0b' }} />
              <span className="status-name">Expiring</span>
              <span className="status-count">{stats.expiringSoon}</span>
              <span className="status-pct">
                {stats.totalProviders
                  ? Math.round((stats.expiringSoon / stats.totalProviders) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="status-row">
              <span className="status-dot" style={{ background: '#ef4444' }} />
              <span className="status-name">Expired / At risk</span>
              <span className="status-count">{stats.expiredCredentials}</span>
              <span className="status-pct">
                {stats.totalProviders
                  ? Math.round((stats.expiredCredentials / stats.totalProviders) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="status-row">
              <span className="status-dot" style={{ background: '#94a3b8' }} />
              <span className="status-name">Pending review</span>
              <span className="status-count">{stats.pendingVerification}</span>
              <span className="status-pct">
                {stats.totalProviders
                  ? Math.round((stats.pendingVerification / stats.totalProviders) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <h3 className="panel-title">Priority spotlight</h3>
          <div className="priority-grid">
            <div className="priority-card priority-red">
              <div className="priority-num">{stats.expiredCredentials}</div>
              <div className="priority-label">Expired</div>
            </div>
            <div className="priority-card priority-orange">
              <div className="priority-num">{stats.expiringSoon}</div>
              <div className="priority-label">Expiring</div>
            </div>
            <div className="priority-card priority-blue">
              <div className="priority-num">{stats.pendingVerification}</div>
              <div className="priority-label">Pending verify</div>
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <h3 className="panel-title">Compliance goal</h3>
          <div className="goal-box">
            <div className={`goal-status ${stats.zeroExpiredCritical ? 'ok' : 'alert'}`}>
              {stats.zeroExpiredCritical ? 'ON TRACK' : 'ACTION NEEDED'}
            </div>
            <p className="goal-text">
              Zero expired critical credentials · 100% verified providers · 100% current privileges
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Providers needing attention</h2>
        {topRisk.length === 0 ? (
          <div className="empty-state">
            <p>
              {hasActiveFilters
                ? 'No providers needing attention match your filters.'
                : 'All shown providers are at or above 90% compliance.'}
            </p>
            {hasActiveFilters && (
              <button className="btn-sm" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="provider-cards">
            {topRisk.map((p) => (
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
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 90) return '#0d9488';
  if (score >= 70) return '#d97706';
  return '#dc2626';
}
