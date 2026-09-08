import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { irmsApi } from '../api/irms';
import { 
  Search, 
  Download, 
  Plus, 
  Filter, 
  RotateCcw, 
  FolderKanban, 
  ArrowRight, 
  Clock, 
  Building2, 
  AlertTriangle 
} from 'lucide-react';

export default function CasesList({ currentUser, onOpenRaiseModal }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [caseType, setCaseType] = useState('');
  const [priority, setPriority] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  async function fetchCases() {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (caseType) params.case_type = caseType;
      if (priority) params.priority = priority;
      if (locationFilter) params.location = locationFilter;
      if (sortBy) params.sortBy = sortBy;

      const data = await irmsApi.listCases(params);
      setCases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCases();
  }, [search, status, caseType, priority, locationFilter, sortBy, currentUser]);

  function exportCSV() {
    const headers = ['Case ID', 'Type', 'Subject', 'Employee ID', 'Employee Name', 'Department', 'Location', 'Stage', 'Priority', 'SLA Due Date', 'Status'];
    const rows = cases.map(c => [
      c.case_number,
      c.case_type,
      `"${(c.subject || '').replace(/"/g, '""')}"`,
      c.employee_id,
      `"${(c.employee_name || '').replace(/"/g, '""')}"`,
      `"${(c.department || '').replace(/"/g, '""')}"`,
      `"${(c.location || '').replace(/"/g, '""')}"`,
      c.current_stage,
      c.priority,
      c.sla_due_date || 'N/A',
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DHL_IRMS_Cases_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleResetFilters() {
    setSearch('');
    setStatus('');
    setCaseType('');
    setPriority('');
    setLocationFilter('');
    setSortBy('newest');
  }

  const hasActiveFilters = search || status || caseType || priority || locationFilter || sortBy !== 'newest';

  return (
    <div>
      {/* PAGE HERO HEADER */}
      <div className="page-hero-header">
        <div>
          <h1 className="hero-heading">Central Case &amp; Action Registry</h1>
          <p className="hero-tagline">
            Master repository for employee grievances, disciplinary matters, union proceedings, and workplace queries.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={exportCSV} className="btn btn-outline" title="Export current list to CSV">
            <Download size={16} />
            <span>Export CSV ({cases.length})</span>
          </button>
          <button onClick={onOpenRaiseModal} className="btn btn-primary">
            <Plus size={16} strokeWidth={3} />
            <span>Raise Concern</span>
          </button>
        </div>
      </div>

      {/* SEARCH & MULTI-FILTER BAR */}
      <div className="irms-card" style={{ padding: '22px 26px', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label className="form-label">Search Keyword / Ref / Name</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                placeholder="e.g. IR-2026, Samuel, Shift"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label className="form-label">Case Type</label>
            <select className="form-control" value={caseType} onChange={(e) => setCaseType(e.target.value)}>
              <option value="">All Case Types</option>
              <option value="grievance">Grievance</option>
              <option value="disciplinary">Disciplinary</option>
              <option value="union">Union / JCC</option>
              <option value="concern">Workplace Concern</option>
              <option value="query">HR Policy Query</option>
            </select>
          </div>

          <div>
            <label className="form-label">Workflow Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="investigation">Investigation</option>
              <option value="hearing">Hearing</option>
              <option value="closed">Closed / Resolved</option>
            </select>
          </div>

          <div>
            <label className="form-label">Priority Level</label>
            <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="urgent">Urgent (48h SLA)</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="form-label">Sort Order</label>
            <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest Registered First</option>
              <option value="oldest">Oldest First</option>
              <option value="sla_urgent">SLA Due Date (Most Urgent)</option>
              <option value="priority">Priority Tier</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {cases.length} filtered cases
            </span>
            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', color: 'var(--dhl-red)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* CASES DATA TABLE */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <FolderKanban size={20} style={{ color: 'var(--dhl-red)' }} />
            <span>Industrial Relations Master Case Register</span>
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
            {cases.length} Active Records
          </span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            Querying IR Central Registry…
          </div>
        ) : error ? (
          <div style={{ padding: 24, color: 'var(--accent-red)', background: 'var(--accent-red-bg)', borderRadius: 'var(--radius-md)' }}>
            Error fetching case registry: {error}
          </div>
        ) : cases.length === 0 ? (
          <div style={{ padding: 56, textAlign: 'center', color: 'var(--text-muted)' }}>
            <FolderKanban size={40} style={{ margin: '0 auto 12px', color: 'var(--text-light)' }} />
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)' }}>No matching cases found</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search criteria or reset active filters.</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="irms-table">
              <thead>
                <tr>
                  <th>Case Ref ID</th>
                  <th>Classification</th>
                  <th>Subject &amp; Details</th>
                  <th>Employee / Complainant</th>
                  <th>Station Hub</th>
                  <th>Workflow Stage</th>
                  <th>Priority SLA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong style={{ color: 'var(--dhl-red)', fontSize: 13.5 }}>{c.case_number}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${c.case_type}`}>{c.case_type}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.subject}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                        Category: {c.category || 'General'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.employee_name || 'Staff Member'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}><code>{c.employee_id}</code></div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
                        <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{c.location?.split('(')[0] || 'Lagos Hub'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${c.current_stage}`}>
                        {c.current_stage?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${c.priority}`}>{c.priority}</span>
                      {c.sla_due_date && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={11} />
                          <span>Due: {new Date(c.sla_due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${c.status}`}>{c.status}</span>
                    </td>
                    <td>
                      <Link to={`/cases/${c.id}`} className="btn btn-sm btn-primary">
                        <span>Workspace</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
