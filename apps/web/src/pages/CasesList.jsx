import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { irmsApi } from '../api/irms';

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
      `"${c.subject.replace(/"/g, '""')}"`,
      c.employee_id,
      `"${c.employee_name}"`,
      `"${c.department}"`,
      `"${c.location}"`,
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

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Central Case &amp; Action Tracker</h1>
          <div className="page-subtitle">
            Master repository for employee grievances, disciplinary proceedings, union matters, and operational concerns.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={exportCSV} className="btn btn-outline">
            📥 Export CSV
          </button>
          <button onClick={onOpenRaiseModal} className="btn btn-danger">
            ➕ Raise Concern
          </button>
        </div>
      </div>

      {/* SEARCH & MULTI-FILTER CONTROLS */}
      <div className="irms-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label className="form-label" style={{ fontSize: 11 }}>Search Case / Employee / Ref</label>
            <input
              className="form-control"
              placeholder="e.g. IR-2026 or Samuel"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 11 }}>Case Type</label>
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
            <label className="form-label" style={{ fontSize: 11 }}>Status</label>
            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="investigation">Investigation</option>
              <option value="hearing">Hearing</option>
              <option value="closed">Closed / Resolved</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 11 }}>Priority</label>
            <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="urgent">Urgent (48h)</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 11 }}>Sort Order</label>
            <select className="form-control" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
              <option value="deadline">Closest SLA Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* MASTER DATA TABLE */}
      {error && <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 14, borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div className="table-responsive">
        <table className="irms-table">
          <thead>
            <tr>
              <th>Case Number</th>
              <th>Type</th>
              <th>Subject &amp; Category</th>
              <th>Employee</th>
              <th>Location &amp; Dept</th>
              <th>Current Stage</th>
              <th>Priority</th>
              <th>SLA Target</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#64748B' }}>
                  Filtering case registry records…
                </td>
              </tr>
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#64748B' }}>
                  No cases matched the search criteria.
                </td>
              </tr>
            ) : (
              cases.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong style={{ color: '#D40511', fontSize: 13 }}>{c.case_number}</strong>
                  </td>
                  <td>
                    <span className={`badge badge-${c.case_type}`}>
                      {c.case_type}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.subject}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{c.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.employee_name}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{c.employee_id}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{c.location.split('(')[0]}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>{c.department.split('&')[0]}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${c.current_stage}`}>
                      {c.current_stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${c.priority}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td>
                    {c.sla_due_date ? (
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: new Date(c.sla_due_date) < new Date() && c.status !== 'closed' ? '#DC2626' : '#0F172A'
                      }}>
                        📅 {c.sla_due_date}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge badge-${c.status}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/cases/${c.id}`}
                      className="btn btn-sm btn-primary"
                      style={{ fontSize: 11.5, padding: '4px 10px' }}
                    >
                      Workspace →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
