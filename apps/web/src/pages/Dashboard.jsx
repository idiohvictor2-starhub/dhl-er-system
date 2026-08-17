import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { irmsApi } from '../api/irms';
import AIExecutivePanel from '../components/AIExecutivePanel';

export default function Dashboard({ currentUser, onOpenRaiseModal }) {
  const [summary, setSummary] = useState(null);
  const [userCases, setUserCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [sumData, casesData] = await Promise.all([
          irmsApi.getDashboardSummary(),
          irmsApi.listCases()
        ]);
        setSummary(sumData);
        setUserCases(casesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>Loading Command Center intelligence…</div>;
  if (error) return <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 16, borderRadius: 8 }}>{error}</div>;

  const isEmployee = currentUser?.role === 'employee';
  const isLineManager = currentUser?.role === 'line_manager';
  const isManagement = currentUser?.role === 'hr_director';
  const isIRAdmin = currentUser?.role === 'er_manager' || currentUser?.role === 'sys_admin';

  return (
    <div>
      {/* HEADER GREETING & ROLE INDICATOR */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            {isEmployee && `Welcome back, ${currentUser?.name}`}
            {isLineManager && `Operations Management Hub — ${currentUser?.department}`}
            {isIRAdmin && 'Industrial Relations Operations Command Center'}
            {isManagement && 'Executive Strategic IR Intelligence'}
          </h1>
          <div className="page-subtitle">
            Organization: <strong>DHL Express Nigeria</strong> · Location: <strong>{currentUser?.location}</strong> · Role: <strong>{currentUser?.role_title || currentUser?.role}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onOpenRaiseModal} className="btn btn-danger">
            ➕ Log New Concern / Query
          </button>
          {(isIRAdmin || isManagement) && (
            <Link to="/reports" className="btn btn-outline">
              📑 Generate Q-Report
            </Link>
          )}
        </div>
      </div>

      {/* TOP KPI CARDS (ROLE CUSTOMIZED) */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-indicator" style={{ background: '#2563EB' }} />
          <div className="kpi-label">{isEmployee ? 'My Active Cases' : 'Active Open Cases'}</div>
          <div className="kpi-value" style={{ color: '#2563EB' }}>
            {isEmployee ? userCases.filter(c => c.status !== 'closed').length : summary?.kpis?.open_cases || 0}
          </div>
          <div className="kpi-meta">Across designated hubs</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-indicator" style={{ background: '#DC2626' }} />
          <div className="kpi-label">Overdue Against SLA</div>
          <div className="kpi-value" style={{ color: '#DC2626' }}>
            {summary?.kpis?.overdue_cases || 0}
          </div>
          <div className="kpi-meta">SLA breach risk alert</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-indicator" style={{ background: '#16A34A' }} />
          <div className="kpi-label">SLA Compliance</div>
          <div className="kpi-value" style={{ color: '#16A34A' }}>
            {summary?.kpis?.sla_compliance_pct || 91}%
          </div>
          <div className="kpi-meta">Benchmark target: 90%</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-indicator" style={{ background: '#7C3AED' }} />
          <div className="kpi-label">Avg. Resolution</div>
          <div className="kpi-value" style={{ color: '#7C3AED' }}>
            {summary?.kpis?.avg_resolution_days || 8.4} <span style={{ fontSize: 14 }}>days</span>
          </div>
          <div className="kpi-meta">3.1 days faster vs Q2</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-indicator" style={{ background: '#D97706' }} />
          <div className="kpi-label">Training Completion</div>
          <div className="kpi-value" style={{ color: '#D97706' }}>
            {summary?.kpis?.training_completion_pct || 88}%
          </div>
          <div className="kpi-meta">Key staff &amp; managers</div>
        </div>
      </div>

      {/* AI INTELLIGENCE LAYER (FOR HR ADMIN & MANAGEMENT) */}
      {(isIRAdmin || isManagement || isLineManager) && (
        <AIExecutivePanel />
      )}

      {/* EMPLOYEE PERSONAL CASE RADAR */}
      {isEmployee && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">
              <span>📋</span> My Registered Concerns &amp; Grievances
            </div>
            <button onClick={onOpenRaiseModal} className="btn btn-sm btn-primary">
              + Raise New Matter
            </button>
          </div>

          <div className="table-responsive">
            <table className="irms-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Category &amp; Subject</th>
                  <th>Date Raised</th>
                  <th>Current Stage</th>
                  <th>Assigned HR Lead</th>
                  <th>SLA Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 24, color: '#64748B' }}>
                      You have no active grievances or concerns filed.
                    </td>
                  </tr>
                ) : (
                  userCases.map(c => (
                    <tr key={c.id}>
                      <td><strong style={{ color: '#D40511' }}>{c.case_number}</strong></td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.subject}</div>
                        <div style={{ fontSize: 11.5, color: '#64748B' }}>{c.category}</div>
                      </td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${c.current_stage}`}>
                          {c.current_stage.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{c.owner_name}</td>
                      <td>
                        <span style={{ color: new Date(c.sla_due_date) < new Date() && c.status !== 'closed' ? '#DC2626' : '#0F172A', fontWeight: 600 }}>
                          📅 {c.sla_due_date}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${c.status}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/cases/${c.id}`} className="btn btn-sm btn-outline">
                          Track Status →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OPERATIONS & MANAGEMENT HUBS */}
      {!isEmployee && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {/* Active Cases Registry Preview */}
          <div className="irms-card" style={{ gridColumn: 'span 2' }}>
            <div className="irms-card-header">
              <div className="irms-card-title">
                <span>📁</span> Priority Industrial Relations Cases
              </div>
              <Link to="/cases" className="btn btn-sm btn-outline">
                View All Master Cases →
              </Link>
            </div>

            <div className="table-responsive">
              <table className="irms-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Type</th>
                    <th>Employee</th>
                    <th>Location</th>
                    <th>Stage</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userCases.slice(0, 5).map(c => (
                    <tr key={c.id}>
                      <td><strong style={{ color: '#D40511' }}>{c.case_number}</strong></td>
                      <td><span className={`badge badge-${c.case_type}`}>{c.case_type}</span></td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.employee_name}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{c.employee_id}</div>
                      </td>
                      <td>{c.location.split('(')[0]}</td>
                      <td><span className={`badge badge-${c.current_stage}`}>{c.current_stage.replace('_', ' ')}</span></td>
                      <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                      <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                      <td>
                        <Link to={`/cases/${c.id}`} className="btn btn-sm btn-outline">
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Location & Hub Performance */}
          <div className="irms-card">
            <div className="irms-card-header">
              <div className="irms-card-title">
                <span>📍</span> Hub Performance &amp; Risk
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {summary?.location_breakdown?.map(loc => (
                <div
                  key={loc.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{loc.name.split('(')[0]}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>
                      Type: {loc.type} · Active Cases: <strong>{loc.open_cases}</strong>
                    </div>
                  </div>
                  <div>
                    {loc.overdue_cases > 0 ? (
                      <span className="badge badge-overdue">⚠️ {loc.overdue_cases} Overdue</span>
                    ) : (
                      <span className="badge badge-resolved">✓ SLA Nominal</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
