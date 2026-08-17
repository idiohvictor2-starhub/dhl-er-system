import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCases } from '../api/cases';

export default function CasesList() {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (typeFilter) filters.case_type = typeFilter;

    listCases(filters).then(setCases).catch((err) => setError(err.message));
  }, [statusFilter, typeFilter]);

  if (error) return <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 16, borderRadius: 8 }}>{error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2>Active Cases Register</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="input-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <select className="input-field" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="grievance">Grievance</option>
            <option value="disciplinary">Disciplinary</option>
            <option value="union">Union</option>
          </select>
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Case Type</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Location</th>
              <th>Current Stage</th>
              <th>Next Deadline</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No cases found matching the criteria.
                </td>
              </tr>
            ) : (
              cases.map((c) => (
                <tr key={c.id}>
                  <td><strong>#{c.id}</strong></td>
                  <td>
                    <span className={`badge badge-${c.case_type}`}>
                      {c.case_type}
                    </span>
                  </td>
                  <td><code>{c.employee_id}</code></td>
                  <td>{c.department}</td>
                  <td>{c.location}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{c.current_stage}</span>
                  </td>
                  <td>
                    {c.deadline ? (
                      <span style={{ color: new Date(c.deadline) < new Date() && c.status === 'open' ? '#dc2626' : '#475569', fontWeight: 500 }}>
                        📅 {c.deadline}
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
                      style={{
                        display: 'inline-block',
                        background: '#f1f5f9',
                        color: '#0f172a',
                        textDecoration: 'none',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 12
                      }}
                    >
                      View Details →
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

