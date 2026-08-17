import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

export default function AIExecutivePanel() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    irmsApi.getAIInsights()
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !insights) {
    return (
      <div className="ai-panel">
        <div style={{ color: '#FFCC00', fontWeight: 600 }}>Analyzing organizational trends and SLA signals…</div>
      </div>
    );
  }

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div className="ai-title">
          <span>🤖</span>
          <span>AI Industrial Relations Intelligence &amp; Risk Radar</span>
        </div>
        <span className="ai-badge">Decision Support Active</span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: '#FFCC00', marginBottom: 4 }}>
          ⚡ Executive Briefing: {insights.executive_summary.headline}
        </div>
        <div style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>
          {insights.executive_summary.key_finding}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
        {/* Recurrence Clusters */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', marginBottom: 8 }}>
            🔍 Emerging Recurrence Clusters
          </div>
          {insights.emerging_clusters.map((c) => (
            <div key={c.cluster_id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: '#FFFFFF' }}>{c.topic}</div>
              <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>
                📍 {c.affected_locations.join(', ')} · <strong>{c.recurrence_frequency}</strong>
              </div>
              <div style={{ fontSize: 11.5, color: '#FEF08A', marginTop: 4 }}>
                💡 Recommendation: {c.ai_recommendation}
              </div>
            </div>
          ))}
        </div>

        {/* SLA Risk Radar */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#FCA5A5', textTransform: 'uppercase', marginBottom: 8 }}>
            ⚠️ SLA Breach Risk Radar
          </div>
          {insights.sla_risk_radar.map((s) => (
            <div key={s.case_number} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: 12.5, color: '#FFCC00' }}>{s.case_number}</span>
                <span style={{ fontSize: 10.5, background: '#7F1D1D', color: '#FEE2E2', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  {s.days_until_deadline} Days to SLA
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#E2E8F0', marginTop: 2 }}>{s.subject}</div>
              <div style={{ fontSize: 11.5, color: '#CBD5E1', marginTop: 3 }}>
                Bottleneck: <span style={{ color: '#F87171' }}>{s.bottleneck}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-disclaimer">
        🛡️ {insights.disclaimer}
      </div>
    </div>
  );
}
