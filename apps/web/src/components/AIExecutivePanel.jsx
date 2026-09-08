import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { Bot, Sparkles, AlertTriangle, Layers, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

export default function AIExecutivePanel() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clusters'); // 'clusters' | 'sla'

  useEffect(() => {
    irmsApi.getAIInsights()
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !insights) {
    return (
      <div className="ai-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--dhl-yellow)', fontWeight: 700 }}>
          <Activity size={20} className="animate-spin" />
          <span>Synthesizing nationwide IR signals, grievance patterns &amp; SLA breach risks…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-panel">
      {/* AI RADAR HEADER */}
      <div className="ai-header">
        <div className="ai-title">
          <Bot size={22} style={{ color: 'var(--dhl-yellow)' }} />
          <span>DHL IR Intelligence &amp; Predictive Risk Radar</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="ai-badge">
            <Sparkles size={12} style={{ marginRight: 4 }} />
            AI Copilot Active
          </span>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>
            Confidence: <strong style={{ color: '#FFFFFF' }}>94.8%</strong>
          </span>
        </div>
      </div>

      {/* EXECUTIVE BRIEFING HEADLINE */}
      <div style={{
        background: 'rgba(255, 204, 0, 0.08)',
        border: '1px solid rgba(255, 204, 0, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 22px',
        marginBottom: 22
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ background: 'var(--dhl-yellow)', color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>
            KEY EXECUTIVE FINDING
          </span>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--dhl-yellow)' }}>
            {insights.executive_summary?.headline || 'Operational Grievance Volume Nominal with Hub-Specific Shift Clustering'}
          </span>
        </div>
        <div style={{ fontSize: 13.5, color: '#E2E8F0', lineHeight: 1.6 }}>
          {insights.executive_summary?.key_finding}
        </div>
      </div>

      {/* SUB-RADAR TABS */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveTab('clusters')}
          style={{
            background: activeTab === 'clusters' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: activeTab === 'clusters' ? 'var(--dhl-yellow)' : '#94A3B8',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={15} />
          <span>Recurrence Clusters</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 10, fontSize: 11 }}>
            {insights.emerging_clusters?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('sla')}
          style={{
            background: activeTab === 'sla' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: activeTab === 'sla' ? '#F87171' : '#94A3B8',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.15s ease'
          }}
        >
          <AlertTriangle size={15} />
          <span>SLA Breach Risks</span>
          <span style={{ background: 'rgba(239,68,68,0.25)', color: '#FCA5A5', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
            {insights.sla_risk_radar?.length || 0}
          </span>
        </button>
      </div>

      {/* TAB CONTENT 1: RECURRENCE CLUSTERS */}
      {activeTab === 'clusters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {insights.emerging_clusters?.map((c) => (
            <div
              key={c.cluster_id}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cluster {c.cluster_id}
                  </span>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                    {c.recurrence_frequency}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: 14.5, color: '#FFFFFF', marginBottom: 8, lineHeight: 1.35 }}>
                  {c.topic}
                </div>

                <div style={{ fontSize: 12.5, color: '#94A3B8', marginBottom: 12 }}>
                  📍 Locations: <strong style={{ color: '#F1F5F9' }}>{c.affected_locations.join(', ')}</strong>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderLeft: '3px solid var(--dhl-yellow)',
                padding: '12px 14px',
                borderRadius: 4,
                marginTop: 10
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--dhl-yellow)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  AI Suggested Intervention:
                </div>
                <div style={{ fontSize: 12.5, color: '#F1F5F9', marginTop: 4, lineHeight: 1.45 }}>
                  {c.ai_recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 2: SLA BREACH RADAR */}
      {activeTab === 'sla' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {insights.sla_risk_radar?.map((s) => (
            <div
              key={s.case_number}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 20px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 900, fontSize: 14.5, color: 'var(--dhl-yellow)' }}>
                    {s.case_number}
                  </span>
                  <span style={{
                    fontSize: 11.5,
                    background: s.days_until_deadline < 3 ? 'rgba(220, 38, 38, 0.4)' : 'rgba(217, 119, 6, 0.4)',
                    color: '#FEE2E2',
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontWeight: 800
                  }}>
                    ⏳ {s.days_until_deadline} Days Remaining
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: 13.5, color: '#FFFFFF', marginBottom: 8 }}>
                  {s.subject}
                </div>
              </div>

              <div style={{
                background: 'rgba(220, 38, 38, 0.15)',
                borderLeft: '3px solid #EF4444',
                padding: '12px 14px',
                borderRadius: 4,
                marginTop: 10
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#FCA5A5', textTransform: 'uppercase' }}>
                  Identified Operational Bottleneck:
                </div>
                <div style={{ fontSize: 12.5, color: '#FEE2E2', marginTop: 4, lineHeight: 1.4 }}>
                  {s.bottleneck}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI DISCLAIMER & GOVERNANCE BADGE */}
      <div className="ai-disclaimer" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ShieldCheck size={16} style={{ color: 'var(--dhl-yellow)', flexShrink: 0 }} />
        <span>
          <strong>Decision Support System:</strong> {insights.disclaimer || 'AI analysis provides predictive prioritization assistance. All stage advancements and official rulings require authorized human HR signatory review.'}
        </span>
      </div>
    </div>
  );
}
