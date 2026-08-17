import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

export default function QuarterlyReportView({ currentUser }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    irmsApi.getQuarterlyReport()
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !report) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Generating Quarterly Industrial Relations Intelligence Report…</div>;
  }

  return (
    <div>
      <div className="page-header no-print">
        <div className="page-title-group">
          <h1>Automated Quarterly Industrial Relations Executive Review</h1>
          <div className="page-subtitle">
            Comprehensive operational analysis, SLA compliance, union status, and management risk briefing.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} className="btn btn-danger">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT CONTAINER */}
      <div className="irms-card" style={{ padding: 32 }}>
        {/* REPORT HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #D40511', paddingBottom: 16, marginBottom: 24 }}>
          <div>
            <span className="dhl-logo-badge" style={{ fontSize: 20 }}>DHL</span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginTop: 8, marginBottom: 4 }}>
              Industrial Relations Management Report
            </h2>
            <div style={{ fontSize: 13, color: '#64748B' }}>
              Reporting Period: <strong>{report.period}</strong> · Scope: <strong>{report.organization}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Generated: {new Date(report.generated_at).toLocaleString()}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', marginTop: 4 }}>Status: OFFICIAL EXECUTIVE BRIEF</div>
          </div>
        </div>

        {/* EXECUTIVE SUMMARY */}
        <div style={{ background: '#F8FAFC', padding: 18, borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#D40511', textTransform: 'uppercase', marginBottom: 6 }}>
            1. Executive Overview
          </div>
          <p style={{ fontSize: 13.5, color: '#1E293B', lineHeight: 1.6, margin: 0 }}>
            {report.executive_summary}
          </p>
        </div>

        {/* KEY PERFORMANCE METRICS */}
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 12 }}>
          2. Key Performance Indicators
        </div>
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          <div className="kpi-card">
            <div className="kpi-label">Total Cases Tracked</div>
            <div className="kpi-value" style={{ color: '#0F172A' }}>{report.metrics.total_cases_tracked}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Active Open Cases</div>
            <div className="kpi-value" style={{ color: '#2563EB' }}>{report.metrics.active_open_cases}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Resolved This Period</div>
            <div className="kpi-value" style={{ color: '#16A34A' }}>{report.metrics.cases_resolved_this_period}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">SLA Compliance Rate</div>
            <div className="kpi-value" style={{ color: '#16A34A' }}>{report.metrics.sla_compliance_rate}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Avg Resolution Days</div>
            <div className="kpi-value" style={{ color: '#7C3AED' }}>{report.metrics.average_resolution_days}d</div>
          </div>
        </div>

        {/* CASE CATEGORY BREAKDOWN */}
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 12 }}>
          3. Incident Breakdown by Category
        </div>
        <div className="table-responsive" style={{ marginBottom: 24 }}>
          <table className="irms-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Volume</th>
                <th>Share of Total</th>
              </tr>
            </thead>
            <tbody>
              {report.case_breakdown_by_category.map((cat, i) => (
                <tr key={i}>
                  <td><strong>{cat.category}</strong></td>
                  <td>{cat.count}</td>
                  <td><span className="badge badge-grievance">{cat.percentage}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* HUB & REGIONAL PERFORMANCE */}
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 12 }}>
          4. Operating Hub Risk &amp; Volume Matrix
        </div>
        <div className="table-responsive" style={{ marginBottom: 24 }}>
          <table className="irms-table">
            <thead>
              <tr>
                <th>Location / Hub</th>
                <th>Code</th>
                <th>Case Volume</th>
                <th>SLA Adherence</th>
                <th>Assessed Risk</th>
              </tr>
            </thead>
            <tbody>
              {report.location_performance.map((loc, i) => (
                <tr key={i}>
                  <td><strong>{loc.location}</strong></td>
                  <td><code>{loc.code}</code></td>
                  <td>{loc.volume}</td>
                  <td><span style={{ color: '#16A34A', fontWeight: 700 }}>{loc.sla_adherence}</span></td>
                  <td>
                    <span className={`badge ${loc.risk_level === 'Elevated' ? 'badge-high' : 'badge-low'}`}>
                      {loc.risk_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RISK & RECOMMENDATIONS */}
        <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 12 }}>
          5. Emerging Risk Hotspots &amp; Management Recommendations
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {report.risk_assessment_and_recommendations.map((r, i) => (
            <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 13.5, color: '#D40511' }}>
                📍 {r.area}
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                <strong>Risk Factor:</strong> {r.risk}
              </div>
              <div style={{ fontSize: 13, color: '#166534', marginTop: 4, background: '#F0FDF4', padding: 8, borderRadius: 6 }}>
                💡 <strong>Recommended Management Action:</strong> {r.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
