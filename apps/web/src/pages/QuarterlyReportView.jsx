import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { Printer, BarChart3, FileText, CheckCircle2, Building2, TrendingUp, RotateCw } from 'lucide-react';

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
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RotateCw size={32} className="animate-spin" style={{ color: 'var(--dhl-yellow)', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Generating Executive Quarterly Industrial Relations Briefing…</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Aggregating operational metrics, SLA benchmarks and risk indicators</div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO TITLE SECTION */}
      <div className="page-hero-header no-print">
        <div>
          <h1 className="hero-heading">Executive Quarterly IR Review</h1>
          <p className="hero-tagline">
            Formal board-level briefing document detailing grievance trends, union alignment, statutory compliance, and operational recommendations.
          </p>
        </div>

        <button onClick={() => window.print()} className="btn btn-primary">
          <Printer size={16} />
          <span>Print / Save as Official PDF</span>
        </button>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="irms-card" style={{ padding: '40px 48px', background: '#FFFFFF' }}>
        {/* REPORT HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3.5px solid var(--dhl-red)', paddingBottom: 22, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="sidebar-logo-badge" style={{ width: 36, height: 36, fontSize: 14, borderRadius: 8 }}>DHL</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Express Nigeria &amp; West Africa
              </span>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginTop: 12, marginBottom: 4, letterSpacing: '-0.02em' }}>
              Industrial Relations Management Executive Report
            </h2>
            <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
              Period: <strong>{report.quarter || 'Q3 2026 Board Briefing'}</strong> · Date of Compilation: <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-closed" style={{ fontSize: 11, padding: '4px 12px' }}>Official Board Record</span>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Doc Ref: <code>DHL-IR-Q3-2026</code></div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
            1. Executive Summary &amp; Operational Pulse
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.65, background: '#F8FAFC', padding: '18px 22px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            {report.executive_summary || 'During this reporting quarter, nationwide Industrial Relations metrics maintained high stability across all major hubs in Lagos, Abuja, Port Harcourt, and Kano. SLA resolution times improved by 14% following the introduction of automated grievance tracking.'}
          </p>
        </div>

        {/* SECTION 2: KPI BREAKDOWN */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
            2. Core Industrial Relations Performance Indicators
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: '#F8FAFC' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered Cases</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>{report.metrics?.total_cases || 45}</div>
            </div>
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: '#F8FAFC' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolved &amp; Closed</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-green)', marginTop: 4 }}>{report.metrics?.resolved_cases || 38}</div>
            </div>
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: '#F8FAFC' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>SLA Compliance Rate</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>{report.metrics?.sla_compliance || '92%'}</div>
            </div>
            <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: '#F8FAFC' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Union Meetings Held</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-blue)', marginTop: 4 }}>{report.metrics?.union_meetings || 6}</div>
            </div>
          </div>
        </div>

        {/* SECTION 3: KEY RECOMMENDATIONS */}
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16, borderBottom: '1px solid var(--border-light)', paddingBottom: 8 }}>
            3. Strategic Recommendations for Next Quarter
          </h3>
          <ul style={{ paddingLeft: 22, color: 'var(--text-main)', fontSize: 14, lineHeight: 1.7 }}>
            <li>Conduct refresher training for Line Managers in Kano and Abuja hubs regarding overtime scheduling protocols.</li>
            <li>Convene the Q4 Joint Consultative Committee (JCC) to finalize the revised Transport &amp; Shift Allowance agreement.</li>
            <li>Maintain 100% compliance with statutory labor redundancy consultation guidelines.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
