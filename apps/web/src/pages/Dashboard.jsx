import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api/cases';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardSummary().then(setSummary).catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!summary) return <p>Loading…</p>;

  const openCount = summary.snapshot
    .filter((r) => r.status === 'open')
    .reduce((sum, r) => sum + Number(r.count), 0);

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card label="Open cases" value={openCount} />
        <Card label="Overdue against SLA" value={summary.overdue_count} accent="crimson" />
      </div>

      <h3>By type &amp; location</h3>
      <table cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th>Status</th><th>Type</th><th>Location</th><th>Count</th><th>Avg resolution (days)</th>
          </tr>
        </thead>
        <tbody>
          {summary.snapshot.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td>{row.status}</td>
              <td>{row.case_type}</td>
              <td>{row.location}</td>
              <td>{row.count}</td>
              <td>{row.avg_resolution_days ? Number(row.avg_resolution_days).toFixed(1) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ label, value, accent = '#222' }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, minWidth: 160 }}>
      <div style={{ fontSize: 13, color: '#666' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent }}>{value}</div>
    </div>
  );
}
