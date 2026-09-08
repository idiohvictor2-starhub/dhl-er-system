import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { Scale, AlertTriangle, CheckCircle2, Building2, Clock, ShieldCheck, RotateCw } from 'lucide-react';

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

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RotateCw size={32} className="animate-spin" style={{ color: 'var(--dhl-yellow)', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Loading Exit &amp; Restructuring Governance…</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Checking labor compliance gates and statutory consultation records</div>
      </div>
    );
  }

  const isAuthorizedToEdit = currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'sys_admin';

  return (
    <div>
      {/* HERO TITLE SECTION */}
      <div className="page-hero-header">
        <div>
          <h1 className="hero-heading">Exit &amp; Restructure Governance</h1>
          <p className="hero-tagline">
            Statutory Nigerian Labor Act and Collective Bargaining Agreement compliance tracking for employee exits and structural adjustments.
          </p>
        </div>
      </div>

      {/* STATUTORY COMPLIANCE WARNING CARD */}
      <div className="irms-card" style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <AlertTriangle size={20} style={{ color: '#D97706' }} />
          <span style={{ fontWeight: 800, fontSize: 15, color: '#92400E' }}>
            Statutory Redundancy Audit Mandate (Section 20, Labor Act)
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#B45309', lineHeight: 1.55 }}>
          All operational restructuring affecting unionized or non-unionized staff must satisfy: (1) Union Notification, (2) Principle of 'Last In, First Out' (LIFO), and (3) Severance Calculation &amp; Terminal Benefits Signoff prior to final disengagement.
        </p>
      </div>

      {/* REDUNDANCY CASES TABLE */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <Scale size={20} style={{ color: 'var(--dhl-red)' }} />
            <span>Active Restructuring &amp; Severance Governance Register</span>
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
            {cases.length} Exit Proceedings
          </span>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Employee / Staff</th>
                <th>Station Hub</th>
                <th>Exit Category</th>
                <th>Union Consulted</th>
                <th>LIFO Verified</th>
                <th>Severance Signed</th>
                <th>Ministry Notified</th>
                <th>Overall Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id}>
                  <td><strong style={{ color: 'var(--dhl-red)', fontSize: 13.5 }}>{c.case_number}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{c.employee_name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}><code>{c.employee_id}</code></div>
                  </td>
                  <td>{c.location}</td>
                  <td><span className="badge badge-query">{c.exit_type?.replace('_', ' ')}</span></td>
                  
                  {/* CHECKBOX GATES */}
                  <td>
                    <button
                      disabled={!isAuthorizedToEdit}
                      onClick={() => handleToggleField(c.id, 'union_notified', c.union_notified)}
                      style={{
                        background: c.union_notified ? '#ECFDF5' : '#FEF2F2',
                        border: c.union_notified ? '1px solid #A7F3D0' : '1px solid #FECACA',
                        color: c.union_notified ? '#047857' : '#DC2626',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: isAuthorizedToEdit ? 'pointer' : 'default'
                      }}
                    >
                      {c.union_notified ? '✓ Completed' : 'Pending'}
                    </button>
                  </td>

                  <td>
                    <button
                      disabled={!isAuthorizedToEdit}
                      onClick={() => handleToggleField(c.id, 'lifo_applied', c.lifo_applied)}
                      style={{
                        background: c.lifo_applied ? '#ECFDF5' : '#FEF2F2',
                        border: c.lifo_applied ? '1px solid #A7F3D0' : '1px solid #FECACA',
                        color: c.lifo_applied ? '#047857' : '#DC2626',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: isAuthorizedToEdit ? 'pointer' : 'default'
                      }}
                    >
                      {c.lifo_applied ? '✓ Applied' : 'Pending'}
                    </button>
                  </td>

                  <td>
                    <button
                      disabled={!isAuthorizedToEdit}
                      onClick={() => handleToggleField(c.id, 'severance_agreed', c.severance_agreed)}
                      style={{
                        background: c.severance_agreed ? '#ECFDF5' : '#FEF2F2',
                        border: c.severance_agreed ? '1px solid #A7F3D0' : '1px solid #FECACA',
                        color: c.severance_agreed ? '#047857' : '#DC2626',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: isAuthorizedToEdit ? 'pointer' : 'default'
                      }}
                    >
                      {c.severance_agreed ? '✓ Agreed' : 'Pending'}
                    </button>
                  </td>

                  <td>
                    <button
                      disabled={!isAuthorizedToEdit}
                      onClick={() => handleToggleField(c.id, 'ministry_notified', c.ministry_notified)}
                      style={{
                        background: c.ministry_notified ? '#ECFDF5' : '#FEF2F2',
                        border: c.ministry_notified ? '1px solid #A7F3D0' : '1px solid #FECACA',
                        color: c.ministry_notified ? '#047857' : '#DC2626',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: isAuthorizedToEdit ? 'pointer' : 'default'
                      }}
                    >
                      {c.ministry_notified ? '✓ Filed' : 'Pending'}
                    </button>
                  </td>

                  <td>
                    <span className={`badge badge-${c.status}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
