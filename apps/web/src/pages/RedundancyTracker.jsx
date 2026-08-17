import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

export default function RedundancyTracker({ currentUser }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await irmsApi.getRedundancyCases();
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggleField(id, field, currentValue) {
    await irmsApi.updateRedundancyCase(id, { [field]: !currentValue });
    load();
  }

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>Loading Redundancy &amp; Exit records…</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Redundancy, Restructuring &amp; Retirement Tracker</h1>
          <div className="page-subtitle">
            Statutory and collective agreement compliance monitoring for employee exits, early retirements, and organizational restructurings.
          </div>
        </div>
      </div>

      {/* COMPLIANCE WARNING CARD */}
      <div className="irms-card" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#92400E' }}>Mandatory Statutory Compliance Gate</span>
        </div>
        <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.5, margin: 0 }}>
          Under the National Labour Act and DHL Collective Bargaining Agreements, all organizational restructurings require mandatory union notification, consultation documentation, and a formal redeployment viability assessment before severance finalization. Incomplete steps trigger automated compliance red flags.
        </p>
      </div>

      {/* REDUNDANCY DATA TABLE */}
      <div className="table-responsive">
        <table className="irms-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Department &amp; Hub</th>
              <th>Exit Category</th>
              <th>Union Consulted</th>
              <th>Redeployment Assessed</th>
              <th>Severance Computed</th>
              <th>Compliance Status</th>
              <th>Effective Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id}>
                <td><strong>{c.employee_id}</strong></td>
                <td><span style={{ fontWeight: 700 }}>{c.employee_name}</span></td>
                <td>
                  <div>{c.location.split('(')[0]}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{c.department}</div>
                </td>
                <td>
                  <span className="badge badge-query">{c.case_type.replace('_', ' ')}</span>
                </td>
                <td>
                  {c.union_consulted ? (
                    <span style={{ color: '#16A34A', fontWeight: 700, fontSize: 12 }}>✓ Completed</span>
                  ) : (
                    <span className="badge badge-urgent" style={{ fontSize: 11 }}>🚩 RED FLAG: MISSING</span>
                  )}
                </td>
                <td>
                  {c.redeployment_assessed ? (
                    <span style={{ color: '#16A34A', fontWeight: 700, fontSize: 12 }}>✓ Assessed</span>
                  ) : (
                    <span className="badge badge-medium" style={{ fontSize: 11 }}>⚠️ Pending Assessment</span>
                  )}
                </td>
                <td>
                  {c.severance_calculated ? (
                    <span style={{ color: '#16A34A', fontWeight: 700, fontSize: 12 }}>✓ Computed</span>
                  ) : (
                    <span style={{ color: '#64748B', fontSize: 12 }}>Pending</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${c.final_approval_status === 'approved' ? 'badge-closed' : 'badge-open'}`}>
                    {c.final_approval_status}
                  </span>
                </td>
                <td>📅 {c.effective_date}</td>
                <td>
                  <button
                    onClick={() => handleToggleField(c.id, 'union_consulted', c.union_consulted)}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: 11 }}
                  >
                    Toggle Union Step
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
