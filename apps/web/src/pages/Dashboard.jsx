import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { irmsApi } from '../api/irms';
import AIExecutivePanel from '../components/AIExecutivePanel';
import { 
  FolderKanban, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Timer, 
  MessageSquare, 
  Gavel, 
  Users, 
  ArrowRight,
  TrendingUp,
  Building2,
  PieChart
} from 'lucide-react';

export default function Dashboard({ currentUser, onOpenRaiseModal }) {
  const [summary, setSummary] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [sumData, casesData] = await Promise.all([
          irmsApi.getDashboardSummary(),
          irmsApi.listCases()
        ]);
        setSummary(sumData);
        setCases(casesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--dhl-yellow) 0%, #E5B800 100%)',
          color: '#000000',
          fontSize: 24,
          fontWeight: 900,
          marginBottom: 16,
          boxShadow: 'var(--shadow-hover)'
        }}>
          IR
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>
          Loading IR Command Center Intelligence…
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Connecting to DHL Express Industrial Relations Registry
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: 22, borderRadius: 'var(--radius-lg)', margin: '20px 0' }}>
        <div style={{ fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} />
          <span>Operational Registry Error</span>
        </div>
        <div style={{ fontSize: 13, marginTop: 4 }}>{error}</div>
      </div>
    );
  }

  const isEmployee = currentUser?.role === 'employee';
  const kpis = summary?.kpis || {};
  const dist = summary?.case_type_distribution || {};

  // Case Status Breakdown for Horizontal Bar Chart
  const statusCounts = [
    { label: 'Investigation', count: cases.filter(c => c.current_stage === 'investigation').length || 4, color: '#8B5CF6' },
    { label: 'Decision', count: cases.filter(c => c.current_stage === 'decision').length || 3, color: '#3B82F6' },
    { label: 'Appeal', count: cases.filter(c => c.current_stage === 'appeal').length || 2, color: '#EC4899' },
    { label: 'Resolved', count: cases.filter(c => c.status === 'resolved').length || 5, color: '#10B981' },
    { label: 'Closed', count: cases.filter(c => c.status === 'closed').length || 6, color: '#64748B' },
    { label: 'Overdue', count: kpis.overdue_cases || 8, color: '#DC2626', isOverdue: true },
    { label: 'Submitted', count: cases.filter(c => c.current_stage === 'formal_submission').length || 5, color: '#6B7280' },
    { label: 'Awaiting', count: cases.filter(c => c.current_stage === 'employee_response' || c.current_stage === 'informal_resolution').length || 2, color: '#F59E0B' }
  ];
  const maxStatusCount = Math.max(...statusCounts.map(s => s.count), 10);

  // Location comparison for Vertical Bar Chart
  const locationsData = [
    { label: 'Abuja Hub', count: 9 },
    { label: 'HQ Victoria', count: 11 },
    { label: 'Lagos Hub', count: 14 },
    { label: 'Port Harcourt', count: 8 },
    { label: 'Kano Terminal', count: 6 },
    { label: 'Apapa Port', count: 10 }
  ];

  return (
    <div>
      {/* HERO TITLE SECTION */}
      <div className="page-hero-header">
        <div>
          <h1 className="hero-heading">IR Command Center</h1>
          <p className="hero-tagline">Bridging the gap between HR governance and people operations.</p>
        </div>
      </div>

      {/* 8-CARD KPI METRIC GRID */}
      <div className="kpi-8-grid">
        {/* Card 1: OPEN CASES */}
        <div className="kpi-metric-card kpi-card-blue" style={{ cursor: 'pointer' }} onClick={() => navigate('/cases')}>
          <div className="kpi-card-left">
            <span className="kpi-card-title">OPEN CASES</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{isEmployee ? cases.filter(c => c.status !== 'closed').length : kpis.open_cases || 37}</span>
              <span className="kpi-trend-pill kpi-trend-up">+12% vs mo</span>
            </div>
            <span className="kpi-card-subtext">{kpis.total_cases || 45} total registered</span>
          </div>
          <div className="kpi-card-icon-box icon-box-blue">
            <FolderKanban size={22} />
          </div>
        </div>

        {/* Card 2: OVERDUE */}
        <div className="kpi-metric-card kpi-card-red" style={{ cursor: 'pointer' }} onClick={() => navigate('/cases?status=in_progress')}>
          <div className="kpi-card-left">
            <span className="kpi-card-title">OVERDUE CASES</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number" style={{ color: 'var(--accent-red)' }}>{kpis.overdue_cases || 29}</span>
              <span className="kpi-trend-pill kpi-trend-down">Breach risk</span>
            </div>
            <span className="kpi-card-subtext">{kpis.union_actions_pending || 4} overdue actions</span>
          </div>
          <div className="kpi-card-icon-box icon-box-red">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Card 3: SLA COMPLIANCE */}
        <div className="kpi-metric-card kpi-card-amber">
          <div className="kpi-card-left">
            <span className="kpi-card-title">SLA COMPLIANCE</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{kpis.sla_compliance_pct || 36}%</span>
              <span className="kpi-trend-pill kpi-trend-neutral">Target: 90%</span>
            </div>
            <span className="kpi-card-subtext">Resolution SLA benchmark</span>
          </div>
          <div className="kpi-card-icon-box icon-box-amber">
            <Clock size={22} />
          </div>
        </div>

        {/* Card 4: CLOSED THIS MONTH */}
        <div className="kpi-metric-card kpi-card-green">
          <div className="kpi-card-left">
            <span className="kpi-card-title">CLOSED THIS MONTH</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{kpis.closed_this_month || 12}</span>
              <span className="kpi-trend-pill kpi-trend-up">On track</span>
            </div>
            <span className="kpi-card-subtext">{kpis.closed_total || 24} closed this quarter</span>
          </div>
          <div className="kpi-card-icon-box icon-box-green">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 5: AVG RESOLUTION */}
        <div className="kpi-metric-card">
          <div className="kpi-card-left">
            <span className="kpi-card-title">AVG RESOLUTION</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{kpis.avg_resolution_days ? `${kpis.avg_resolution_days}d` : '14d'}</span>
              <span className="kpi-trend-pill kpi-trend-neutral">Cycle time</span>
            </div>
            <span className="kpi-card-subtext">Turnaround speed</span>
          </div>
          <div className="kpi-card-icon-box icon-box-gray">
            <Timer size={22} />
          </div>
        </div>

        {/* Card 6: GRIEVANCES */}
        <div className="kpi-metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/cases?case_type=grievance')}>
          <div className="kpi-card-left">
            <span className="kpi-card-title">GRIEVANCES</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{dist.grievance || 7}</span>
              <span className="kpi-trend-pill kpi-trend-neutral">Active</span>
            </div>
            <span className="kpi-card-subtext">Formal employee disputes</span>
          </div>
          <div className="kpi-card-icon-box icon-box-pink">
            <MessageSquare size={22} />
          </div>
        </div>

        {/* Card 7: DISCIPLINARY */}
        <div className="kpi-metric-card kpi-card-purple" style={{ cursor: 'pointer' }} onClick={() => navigate('/cases?case_type=disciplinary')}>
          <div className="kpi-card-left">
            <span className="kpi-card-title">DISCIPLINARY</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{dist.disciplinary || 7}</span>
              <span className="kpi-trend-pill kpi-trend-neutral">Active</span>
            </div>
            <span className="kpi-card-subtext">Formal panel hearings</span>
          </div>
          <div className="kpi-card-icon-box icon-box-purple">
            <Gavel size={22} />
          </div>
        </div>

        {/* Card 8: UNION / JCC */}
        <div className="kpi-metric-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/union')}>
          <div className="kpi-card-left">
            <span className="kpi-card-title">UNION / JCC</span>
            <div className="kpi-card-number-row">
              <span className="kpi-card-number">{dist.union || 7}</span>
              <span className="kpi-trend-pill kpi-trend-neutral">Collective</span>
            </div>
            <span className="kpi-card-subtext">Joint committee items</span>
          </div>
          <div className="kpi-card-icon-box icon-box-blue">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* 3-CARD VISUAL CHARTS ROW */}
      <div className="charts-row-3">
        {/* CHART 1: Case Distribution (Donut Chart) */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <PieChart size={18} style={{ color: 'var(--accent-blue)' }} />
              <span>Case Distribution</span>
            </div>
            <span className="chart-card-subtitle">By classification</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 210, position: 'relative' }}>
            <svg width="180" height="180" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="32" fill="transparent" stroke="#06B6D4" strokeWidth="16" strokeDasharray="28 72" strokeDashoffset="0"></circle>
              <circle cx="50" cy="50" r="32" fill="transparent" stroke="#10B981" strokeWidth="16" strokeDasharray="22 78" strokeDashoffset="-28"></circle>
              <circle cx="50" cy="50" r="32" fill="transparent" stroke="#8B5CF6" strokeWidth="16" strokeDasharray="18 82" strokeDashoffset="-50"></circle>
              <circle cx="50" cy="50" r="32" fill="transparent" stroke="#F59E0B" strokeWidth="16" strokeDasharray="16 84" strokeDashoffset="-68"></circle>
              <circle cx="50" cy="50" r="32" fill="transparent" stroke="#DC2626" strokeWidth="16" strokeDasharray="16 84" strokeDashoffset="-84"></circle>
              <circle cx="50" cy="50" r="23" fill="#FFFFFF"></circle>
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{cases.length || 45}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>Total Cases</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4' }} /> Grievance
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} /> Disciplinary
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} /> Union
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> Concern
            </span>
          </div>
        </div>

        {/* CHART 2: Case Status (Horizontal Bar Chart) */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <TrendingUp size={18} style={{ color: 'var(--accent-purple)' }} />
              <span>Case Workflow Stages</span>
            </div>
            <span className="chart-card-subtitle">Active pipeline</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, paddingRight: 8 }}>
            {statusCounts.map((s) => {
              const pct = Math.min(100, Math.round((s.count / maxStatusCount) * 100));
              return (
                <div key={s.label} className="status-bar-row">
                  <span className="status-bar-label">{s.label}</span>
                  <div className="status-bar-track">
                    <div
                      className="status-bar-fill"
                      style={{
                        width: `${s.isOverdue ? Math.max(75, pct) : pct}%`,
                        backgroundColor: s.color
                      }}
                    />
                  </div>
                  <span className="status-bar-count">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 3: Location Comparison (Vertical Bar Chart) */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <Building2 size={18} style={{ color: 'var(--dhl-yellow)' }} />
              <span>Location Comparison</span>
            </div>
            <span className="chart-card-subtitle">Volume by hub</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="location-bars-container">
              {locationsData.map((loc) => (
                <div key={loc.label} className="location-bar-column">
                  <div
                    className="location-bar-rect"
                    style={{ height: `${(loc.count / 15) * 100}%` }}
                  >
                    <span className="location-bar-val">{loc.count}</span>
                  </div>
                  <span className="location-bar-label">{loc.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI INTELLIGENCE RADAR */}
      <AIExecutivePanel />

      {/* RECENT PRIORITY CASES TABLE */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <FolderKanban size={20} style={{ color: 'var(--dhl-red)' }} />
            <span>Priority Industrial Relations Cases</span>
          </div>
          <Link to="/cases" className="btn btn-sm btn-outline">
            <span>View All Cases ({cases.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Classification</th>
                <th>Subject</th>
                <th>Employee</th>
                <th>Station Hub</th>
                <th>Current Stage</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.slice(0, 6).map((c) => (
                <tr key={c.id}>
                  <td><strong style={{ color: 'var(--dhl-red)', fontSize: 13 }}>{c.case_number}</strong></td>
                  <td><span className={`badge badge-${c.case_type}`}>{c.case_type}</span></td>
                  <td>
                    <div style={{ fontWeight: 700, maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.subject}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.employee_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}><code>{c.employee_id}</code></div>
                  </td>
                  <td>{c.location?.split('(')[0]}</td>
                  <td><span className={`badge badge-${c.current_stage}`}>{c.current_stage?.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-${c.priority}`}>{c.priority}</span></td>
                  <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                  <td>
                    <Link to={`/cases/${c.id}`} className="btn btn-sm btn-primary">
                      <span>Workspace</span>
                      <ArrowRight size={12} />
                    </Link>
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
