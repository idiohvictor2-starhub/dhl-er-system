import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/cases';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 16, borderRadius: 8 }}>{error}</div>;
  if (!summary) return <p style={{ color: '#64748b' }}>Loading dashboard insights…</p>;

  const openCount = summary.snapshot
    .filter((r) => r.status === 'open')
    .reduce((sum, r) => sum + Number(r.count), 0);

  const closedCount = summary.snapshot
    .filter((r) => r.status === 'closed')
    .reduce((sum, r) => sum + Number(r.count), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Employee Relations Overview</h2>
        <span style={{ fontSize: 13, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: 6 }}>
          ⚡ Active Case Management
        </span>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Active Open Cases</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{openCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overdue vs SLA</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{summary.overdue_count}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolved & Closed</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{closedCount}</div>
        </div>
      </div>

      <h3>Case Breakdown by Type &amp; Location</h3>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Case Type</th>
              <th>Location</th>
              <th>Active Count</th>
              <th>Avg Resolution</th>
            </tr>
          </thead>
          <tbody>
            {summary.snapshot.map((row, i) => (
              <tr key={i}>
                <td>
                  <span className={`badge badge-${row.status}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${row.case_type}`}>
                    {row.case_type}
                  </span>
                </td>
                <td><strong>{row.location}</strong></td>
                <td>{row.count}</td>
                <td>
                  {row.avg_resolution_days
                    ? `${Number(row.avg_resolution_days).toFixed(1)} days`
                    : <span style={{ color: '#94a3b8' }}>In progress</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

