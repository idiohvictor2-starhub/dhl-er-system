import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCase, transitionStage } from '../api/cases';

const STAGES = ['raised', 'investigation', 'hearing', 'decision', 'appeal', 'closed'];

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState(null);
  const [newStage, setNewStage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    getCase(id).then(setCaseData).catch((err) => setError(err.message));
  }

  useEffect(load, [id]);

  async function handleTransition(e) {
    e.preventDefault();
    if (!newStage) return;
    setIsSubmitting(true);
    try {
      await transitionStage(id, newStage);
      setNewStage('');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (error) return <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 16, borderRadius: 8 }}>{error}</div>;
  if (!caseData) return <p style={{ color: '#64748b' }}>Loading case details…</p>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/cases" style={{ color: '#64748b', textDecoration: 'none', fontSize: 14 }}>
          ← Back to All Cases
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ margin: 0 }}>Case #{caseData.id}</h2>
            <span className={`badge badge-${caseData.case_type}`}>{caseData.case_type}</span>
            <span className={`badge badge-${caseData.status}`}>{caseData.status}</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Raised: <strong>{caseData.date_raised ? new Date(caseData.date_raised).toLocaleDateString() : '—'}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, padding: '16px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Employee ID</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{caseData.employee_id}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Department</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{caseData.department}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{caseData.location}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>SLA Deadline</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, color: caseData.deadline && new Date(caseData.deadline) < new Date() && caseData.status === 'open' ? '#dc2626' : '#0f172a' }}>
              {caseData.deadline ? `📅 ${caseData.deadline}` : '—'}
            </div>
          </div>
        </div>

        {caseData.next_action && (
          <div style={{ marginTop: 16, padding: 12, background: '#f8fafc', borderRadius: 8, borderLeft: '4px solid #d40511' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Next Action Required:</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{caseData.next_action}</div>
          </div>
        )}

        {caseData.outcome && (
          <div style={{ marginTop: 16, padding: 12, background: '#f0fdf4', borderRadius: 8, borderLeft: '4px solid #16a34a' }}>
            <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>Final Outcome:</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#14532d', marginTop: 2 }}>{caseData.outcome}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Stage Timeline Audit Trail */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginTop: 0 }}>Stage Progression History</h3>
          <ul className="stage-timeline">
            {caseData.stage_history && caseData.stage_history.map((h, idx) => (
              <li key={h.id || idx} className="stage-item">
                <div style={{ fontWeight: 700, textTransform: 'capitalize', color: '#0f172a' }}>
                  {h.stage}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                  Entered: {new Date(h.entered_at).toLocaleString()}
                  {h.exited_at && ` · Completed: ${new Date(h.exited_at).toLocaleString()}`}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Transition Stage Form */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>Transition Case Stage</h3>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Move this case to the next stage in accordance with DHL ER policy. This action is timestamped in the audit log.
          </p>
          <form onSubmit={handleTransition} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Select New Stage</label>
              <select
                className="input-field"
                style={{ width: '100%' }}
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
              >
                <option value="">-- Select next stage --</option>
                {STAGES.map((s) => (
                  <option key={s} value={s} disabled={s === caseData.current_stage}>
                    {s} {s === caseData.current_stage ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={!newStage || isSubmitting}
              style={{ opacity: !newStage || isSubmitting ? 0.6 : 1 }}
            >
              {isSubmitting ? 'Updating…' : 'Confirm Stage Transition'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

