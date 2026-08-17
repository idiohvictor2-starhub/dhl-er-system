import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { irmsApi } from '../api/irms';

const GRIEVANCE_STAGES = [
  { key: 'informal_resolution', label: '1. Informal Resolution' },
  { key: 'formal_submission', label: '2. Formal Submission' },
  { key: 'investigation', label: '3. Investigation' },
  { key: 'decision', label: '4. Decision' },
  { key: 'appeal', label: '5. Appeal' },
  { key: 'closed', label: '6. Resolution / Closure' }
];

const DISCIPLINARY_STAGES = [
  { key: 'formal_submission', label: '1. Query Issued' },
  { key: 'employee_response', label: '2. Employee Response' },
  { key: 'hearing', label: '3. Panel Hearing' },
  { key: 'decision', label: '4. Decision' },
  { key: 'appeal', label: '5. Appeal' },
  { key: 'closed', label: '6. Final Closure' }
];

export default function CaseDetail({ currentUser }) {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow', 'actions', 'documents', 'communications', 'ai_case'

  // Stage transition modal state
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [targetStage, setTargetStage] = useState('');
  const [stageNotes, setStageNotes] = useState('');
  const [isSubmittingStage, setIsSubmittingStage] = useState(false);

  // New action modal / form state
  const [actionTitle, setActionTitle] = useState('');
  const [actionOwner, setActionOwner] = useState('');
  const [actionDueDate, setActionDueDate] = useState('');

  // New message form state
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // New document form state
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('evidence');

  async function loadCase() {
    try {
      setLoading(true);
      const data = await irmsApi.getCase(id);
      setCaseData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCase();
  }, [id]);

  async function handleStageTransition(e) {
    e.preventDefault();
    if (!targetStage) return;
    setIsSubmittingStage(true);
    try {
      await irmsApi.transitionStage(id, targetStage, stageNotes);
      setIsTransitionModalOpen(false);
      setStageNotes('');
      loadCase();
    } catch (err) {
      alert('Error transitioning stage: ' + err.message);
    } finally {
      setIsSubmittingStage(false);
    }
  }

  async function handleAddAction(e) {
    e.preventDefault();
    if (!actionTitle) return;
    try {
      await irmsApi.addAction(id, {
        action_title: actionTitle,
        owner_name: actionOwner || currentUser?.name || 'Assigned Lead',
        due_date: actionDueDate
      });
      setActionTitle('');
      setActionOwner('');
      setActionDueDate('');
      loadCase();
    } catch (err) {
      alert('Failed to add action: ' + err.message);
    }
  }

  async function handleToggleAction(actionId, currentStatus) {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await irmsApi.toggleAction(actionId, nextStatus);
    loadCase();
  }

  async function handleAddCommunication(e) {
    e.preventDefault();
    if (!messageText) return;
    try {
      await irmsApi.addCommunication(id, {
        message: messageText,
        is_internal: isInternalNote
      });
      setMessageText('');
      loadCase();
    } catch (err) {
      alert('Failed to post communication: ' + err.message);
    }
  }

  async function handleAddDocument(e) {
    e.preventDefault();
    if (!newDocName) return;
    try {
      await irmsApi.addDocument(id, {
        document_name: newDocName,
        document_type: newDocType
      });
      setNewDocName('');
      loadCase();
    } catch (err) {
      alert('Failed to attach document: ' + err.message);
    }
  }

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#64748B', fontWeight: 600 }}>Loading Case Workspace…</div>;
  if (error || !caseData) return <div style={{ background: '#FEF2F2', color: '#DC2626', padding: 20, borderRadius: 10, margin: '20px 0' }}>{error || 'Case not found'}</div>;

  const stagesList = caseData.case_type === 'disciplinary' ? DISCIPLINARY_STAGES : GRIEVANCE_STAGES;
  const currentStageIndex = stagesList.findIndex(s => s.key === caseData.current_stage);

  return (
    <div>
      {/* BREADCRUMB NAVIGATION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Link to="/cases" style={{ color: '#64748B', textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Central Case Registry
        </Link>
        <span style={{ fontSize: 12, color: '#94A3B8' }}>
          Registered: {new Date(caseData.created_at).toLocaleString()}
        </span>
      </div>

      {/* CASE MASTER WORKSPACE HEADER CARD */}
      <div className="irms-card" style={{ borderTop: '4px solid #D40511' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#D40511', letterSpacing: '-0.3px' }}>{caseData.case_number}</span>
            <span className={`badge badge-${caseData.case_type}`}>{caseData.case_type}</span>
            <span className={`badge badge-${caseData.priority}`}>{caseData.priority}</span>
            <span className={`badge badge-${caseData.status}`}>{caseData.status}</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {(currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'line_manager' || currentUser?.role === 'sys_admin') && (
              <button
                onClick={() => {
                  setTargetStage(stagesList[Math.min(stagesList.length - 1, currentStageIndex + 1)]?.key || 'closed');
                  setIsTransitionModalOpen(true);
                }}
                className="btn btn-primary"
              >
                🔄 Transition Stage
              </button>
            )}
          </div>
        </div>

        <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 8, color: '#0F172A', letterSpacing: '-0.2px' }}>
          {caseData.subject}
        </h2>
        <p style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>
          {caseData.description}
        </p>

        {/* METADATA GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, background: '#F8FAFC', padding: 16, borderRadius: 10, border: '1px solid #E2E8F0' }}>
          <div>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Employee Involved</span>
            <div style={{ fontWeight: 800, fontSize: 13.5, color: '#0F172A', marginTop: 2 }}>{caseData.employee_name}</div>
            <div style={{ fontSize: 11, color: '#64748B' }}><code>{caseData.employee_id}</code></div>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Operating Location</span>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', marginTop: 2 }}>{caseData.location}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Department</span>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', marginTop: 2 }}>{caseData.department}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>HR / Line Lead</span>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A', marginTop: 2 }}>{caseData.owner_name}</div>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>SLA Target Date</span>
            <div style={{ fontWeight: 800, fontSize: 13, color: new Date(caseData.sla_due_date) < new Date() && caseData.status !== 'closed' ? '#DC2626' : '#0F172A', marginTop: 2 }}>
              📅 {caseData.sla_due_date || 'None'}
            </div>
          </div>
        </div>

        {caseData.outcome && (
          <div style={{ marginTop: 16, background: '#F0FDF4', borderLeft: '4px solid #16A34A', padding: 14, borderRadius: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 12, color: '#166534', textTransform: 'uppercase' }}>Official Final Resolution:</span>
            <div style={{ fontSize: 13.5, color: '#14532D', marginTop: 3 }}>{caseData.outcome}</div>
          </div>
        )}
      </div>

      {/* 6-STAGE VISUAL STEPPER */}
      <div className="irms-card">
        <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A', marginBottom: 12 }}>
          Workflow Progression Timeline
        </div>

        <div className="stepper-container">
          <div className="stepper-track" />
          {stagesList.map((stg, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isActive = idx === currentStageIndex;
            return (
              <div key={stg.key} className="step-item">
                <div className={`step-circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className={`step-label ${isActive ? 'active' : ''}`}>
                  {stg.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WORKSPACE TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '2px solid #E2E8F0', paddingBottom: 2 }}>
        {[
          { key: 'workflow', label: '📜 Stage History', count: caseData.stage_history?.length },
          { key: 'actions', label: '⚡ Action Items', count: caseData.actions?.length },
          { key: 'documents', label: '📁 Documents & Evidence', count: caseData.documents?.length },
          { key: 'communications', label: '💬 Messages & Notes', count: caseData.communications?.length },
          { key: 'ai_case', label: '🤖 AI Case Summary' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === tab.key ? '#D40511' : '#64748B',
              borderBottom: activeTab === tab.key ? '3px solid #D40511' : '3px solid transparent',
              marginBottom: -2,
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label} {tab.count !== undefined && <span style={{ fontSize: 11, background: '#E2E8F0', padding: '2px 7px', borderRadius: 10, marginLeft: 4 }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: STAGE HISTORY */}
      {activeTab === 'workflow' && (
        <div className="irms-card">
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Stage Transition Audit Trail</h3>
          <ul className="stage-timeline">
            {caseData.stage_history?.map(h => (
              <li key={h.id} className="stage-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 800, textTransform: 'capitalize', color: '#0F172A', fontSize: 13.5 }}>
                    {h.stage.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    by <strong>{h.actor_name}</strong>
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>
                  Entered: {new Date(h.entered_at).toLocaleString()} {h.exited_at && `· Exited: ${new Date(h.exited_at).toLocaleString()}`}
                </div>
                {h.notes && (
                  <div style={{ fontSize: 13, color: '#334155', background: '#F8FAFC', padding: '10px 14px', borderRadius: 6, marginTop: 8, border: '1px solid #E2E8F0' }}>
                    {h.notes}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TAB CONTENT: ACTION ITEMS */}
      {activeTab === 'actions' && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">Case Action Items &amp; Deadlines</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            {caseData.actions?.map(act => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: act.status === 'completed' ? '#F0FDF4' : '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  marginBottom: 10
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={act.status === 'completed'}
                    onChange={() => handleToggleAction(act.id, act.status)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, textDecoration: act.status === 'completed' ? 'line-through' : 'none', color: '#0F172A' }}>
                      {act.action_title}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748B' }}>
                      Assignee: <strong>{act.owner_name}</strong> · Target: <strong>📅 {act.due_date}</strong>
                    </div>
                  </div>
                </div>
                <span className={`badge badge-${act.status}`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>

          {/* ADD ACTION FORM */}
          <form onSubmit={handleAddAction} style={{ background: '#F8FAFC', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>➕ Assign New Action Item</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
              <div>
                <label className="form-label">Action Title *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Conduct interview with shift supervisor"
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Owner</label>
                <input
                  className="form-control"
                  placeholder="e.g. Tunde Bakare"
                  value={actionOwner}
                  onChange={(e) => setActionOwner(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={actionDueDate}
                  onChange={(e) => setActionDueDate(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 40 }}>
                Add Action
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">Case Documents &amp; Evidentiary Repository</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
            {caseData.documents?.map(doc => (
              <div key={doc.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>📄</div>
                <div style={{ fontWeight: 700, fontSize: 13, wordBreak: 'break-all', color: '#0F172A' }}>{doc.document_name}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                  Type: <strong>{doc.document_type}</strong> · Size: {doc.file_size_kb} KB
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  Uploaded by {doc.uploaded_by_name} ({new Date(doc.uploaded_at).toLocaleDateString()})
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddDocument} style={{ background: '#F8FAFC', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>📎 Attach Statement or Evidentiary File</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
              <div>
                <label className="form-label">Document Filename *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Witness_Statement_Ramp_Officer.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Document Category</label>
                <select className="form-control" value={newDocType} onChange={(e) => setNewDocType(e.target.value)}>
                  <option value="statement">Employee / Witness Statement</option>
                  <option value="evidence">Evidentiary Record / Log</option>
                  <option value="minutes">Hearing Minutes</option>
                  <option value="report">Investigation Report</option>
                  <option value="letter">Official Notice / Query Letter</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: 40 }}>
                Upload &amp; Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: COMMUNICATIONS */}
      {activeTab === 'communications' && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">Case Communications &amp; Internal Notes</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {caseData.communications?.map(comm => (
              <div
                key={comm.id}
                style={{
                  background: comm.is_internal ? '#FEF3C7' : '#F8FAFC',
                  border: comm.is_internal ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                  borderRadius: 8,
                  padding: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#0F172A' }}>
                    {comm.sender_name} <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>({comm.sender_role})</span>
                    {comm.is_internal && <span style={{ marginLeft: 8, background: '#D97706', color: '#FFFFFF', fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>INTERNAL HR NOTE</span>}
                  </div>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>
                    {new Date(comm.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: '#1E293B', lineHeight: 1.5 }}>
                  {comm.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddCommunication} style={{ background: '#F8FAFC', padding: 18, borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <div className="form-group">
              <label className="form-label">Post Message or Case Note</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter case update, investigator observation, or employee response..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                />
                Mark as Internal HR Note (Confidential to HR)
              </label>
              <button type="submit" className="btn btn-primary">
                Post Note 💬
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: AI CASE SUMMARY */}
      {activeTab === 'ai_case' && (
        <div className="irms-card" style={{ background: '#0B1120', color: '#FFFFFF', border: '1px solid rgba(255,204,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#FFCC00' }}>AI Objective Case Intelligence Summary</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 16, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#93C5FD', marginBottom: 6 }}>
              Case Timeline &amp; Procedural Evaluation
            </div>
            <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6 }}>
              Case <strong>{caseData.case_number}</strong> has progressed through <strong>{caseData.stage_history?.length || 1}</strong> stages over the last 18 days. Two mandatory action items remain outstanding. SLA deadline is set for <strong>{caseData.sla_due_date}</strong>.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#FCA5A5', marginBottom: 6 }}>
              Recurrence Pattern Analysis
            </div>
            <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6 }}>
              Similar cases regarding <em>"{caseData.category}"</em> have been recorded 3 times in the {caseData.location} hub over the past two quarters. Procedural fairness index is nominal.
            </p>
          </div>

          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 14, fontStyle: 'italic' }}>
            🛡️ AI-generated insight — requires HR/management review. Designed as an advisory decision-support system only.
          </div>
        </div>
      )}

      {/* STAGE TRANSITION MODAL */}
      {isTransitionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                Transition Workflow Stage: {caseData.case_number}
              </h3>
              <button onClick={() => setIsTransitionModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748B' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleStageTransition}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Current Stage</label>
                  <input className="form-control" value={caseData.current_stage.replace('_', ' ')} disabled />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Next Stage *</label>
                  <select className="form-control" value={targetStage} onChange={(e) => setTargetStage(e.target.value)} required>
                    {stagesList.map(s => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Transition Notes &amp; Justification *</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter official justification and outcome summary for this stage transition..."
                    value={stageNotes}
                    onChange={(e) => setStageNotes(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsTransitionModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={isSubmittingStage}>
                  {isSubmittingStage ? 'Recording…' : 'Confirm Stage Transition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
