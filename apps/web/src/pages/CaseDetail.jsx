import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { irmsApi } from '../api/irms';
import { 
  ArrowLeft, 
  Clock, 
  Building2, 
  User, 
  Calendar, 
  RotateCw, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  Layers, 
  Bot, 
  Sparkles, 
  Upload, 
  Plus, 
  Send,
  ShieldCheck,
  Check,
  AlertTriangle
} from 'lucide-react';

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

  // New action form state
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

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RotateCw size={32} className="animate-spin" style={{ color: 'var(--dhl-yellow)', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Loading Case Workspace…</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Retrieving evidence, stage history and audit trails</div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: 22, borderRadius: 'var(--radius-lg)', margin: '24px 0' }}>
        <strong>⚠️ Error:</strong> {error || 'Case not found'}
      </div>
    );
  }

  const stagesList = caseData.case_type === 'disciplinary' ? DISCIPLINARY_STAGES : GRIEVANCE_STAGES;
  const currentStageIndex = stagesList.findIndex(s => s.key === caseData.current_stage);
  const isAuthorizedToTransition = currentUser?.role === 'er_manager' || currentUser?.role === 'hr_director' || currentUser?.role === 'line_manager' || currentUser?.role === 'sys_admin';
  const isOverdue = caseData.sla_due_date && new Date(caseData.sla_due_date) < new Date() && caseData.status !== 'closed';

  return (
    <div>
      {/* BREADCRUMB NAVIGATION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <Link
          to="/cases"
          style={{
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: 13.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Central Case Registry</span>
        </Link>
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
          Registered in System: <strong>{new Date(caseData.created_at).toLocaleString()}</strong>
        </span>
      </div>

      {/* CASE MASTER WORKSPACE HERO CARD */}
      <div className="irms-card" style={{ borderTop: '4px solid var(--dhl-red)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--dhl-red)', letterSpacing: '-0.02em' }}>
              {caseData.case_number}
            </span>
            <span className={`badge badge-${caseData.case_type}`}>{caseData.case_type}</span>
            <span className={`badge badge-${caseData.priority}`}>{caseData.priority}</span>
            <span className={`badge badge-${caseData.status}`}>{caseData.status}</span>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {isAuthorizedToTransition && (
              <button
                onClick={() => {
                  setTargetStage(stagesList[Math.min(stagesList.length - 1, currentStageIndex + 1)]?.key || 'closed');
                  setIsTransitionModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <RotateCw size={15} />
                <span>Transition Stage</span>
              </button>
            )}
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          {caseData.subject}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          {caseData.description}
        </p>

        {/* METADATA GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 16,
          background: '#F8FAFC',
          padding: '20px 22px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Employee Involved
            </span>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: 'var(--text-main)', marginTop: 4 }}>{caseData.employee_name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}><code>{caseData.employee_id}</code></div>
          </div>

          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operating Hub
            </span>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-main)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
              <span>{caseData.location}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Department
            </span>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-main)', marginTop: 4 }}>{caseData.department}</div>
          </div>

          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HR / Lead Handler
            </span>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-main)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} style={{ color: 'var(--text-muted)' }} />
              <span>{caseData.owner_name}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SLA Target Deadline
            </span>
            <div style={{ fontWeight: 800, fontSize: 14, color: isOverdue ? 'var(--dhl-red)' : 'var(--text-main)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} />
              <span>{caseData.sla_due_date || 'None Assigned'}</span>
            </div>
          </div>
        </div>

        {caseData.outcome && (
          <div style={{ marginTop: 20, background: '#ECFDF5', borderLeft: '4px solid #10B981', padding: '16px 20px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Official Final Ruling &amp; Settlement:
            </div>
            <div style={{ fontSize: 14, color: '#065F46', marginTop: 4, fontWeight: 600 }}>{caseData.outcome}</div>
          </div>
        )}
      </div>

      {/* WORKSPACE TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid var(--border-light)', paddingBottom: 2, overflowX: 'auto' }}>
        {[
          { key: 'workflow', label: 'Stage History', icon: <Layers size={16} />, count: caseData.stage_history?.length },
          { key: 'actions', label: 'Action Items', icon: <CheckCircle2 size={16} />, count: caseData.actions?.length },
          { key: 'documents', label: 'Documents & Evidence', icon: <FileText size={16} />, count: caseData.documents?.length },
          { key: 'communications', label: 'Messages & Notes', icon: <MessageSquare size={16} />, count: caseData.communications?.length },
          { key: 'ai_case', label: 'AI Copilot Analysis', icon: <Bot size={16} /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: 13.5,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--dhl-red)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.key ? '3px solid var(--dhl-red)' : '3px solid transparent',
              marginBottom: -2,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span style={{ fontSize: 11, background: '#F1F5F9', color: 'var(--text-main)', padding: '2px 8px', borderRadius: 10, marginLeft: 2 }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: STAGE TRANSITION HISTORY */}
      {activeTab === 'workflow' && (
        <div className="irms-card">
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, color: 'var(--text-main)' }}>Stage Transition Audit Trail</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {caseData.stage_history?.map(h => (
              <div key={h.id} style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: '#F8FAFC',
                border: '1px solid var(--border-light)',
                borderLeft: '4px solid var(--dhl-yellow)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, textTransform: 'capitalize', color: 'var(--text-main)', fontSize: 15 }}>
                    {h.stage?.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(h.entered_at).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Advanced by: <strong style={{ color: 'var(--text-main)' }}>{h.actor_name}</strong>
                </div>
                {h.notes && (
                  <div style={{ fontSize: 13, color: 'var(--text-main)', background: '#FFFFFF', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', lineHeight: 1.5 }}>
                    {h.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTION ITEMS CHECKLIST */}
      {activeTab === 'actions' && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">
              <CheckCircle2 size={20} style={{ color: 'var(--accent-green)' }} />
              <span>Investigation &amp; Hearing Action Items</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {caseData.actions?.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>No action items recorded for this case yet.</p>
            ) : (
              caseData.actions?.map(a => {
                const isCompleted = a.status === 'completed';
                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: isCompleted ? '#ECFDF5' : '#F8FAFC',
                      border: isCompleted ? '1px solid #A7F3D0' : '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggleAction(a.id, a.status)}
                        style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--dhl-red)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#065F46' : 'var(--text-main)' }}>
                          {a.action_title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          Owner: <strong>{a.owner_name}</strong> {a.due_date && `· Due: ${a.due_date}`}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${isCompleted ? 'badge-closed' : 'badge-in_progress'}`}>
                      {a.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* ADD ACTION FORM */}
          <form onSubmit={handleAddAction} style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: 'var(--text-main)' }}>+ Add New Action Item</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
              <input
                required
                className="form-control"
                placeholder="Action item title..."
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
              />
              <input
                className="form-control"
                placeholder="Assignee / Owner Name"
                value={actionOwner}
                onChange={(e) => setActionOwner(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                value={actionDueDate}
                onChange={(e) => setActionDueDate(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add Action Item</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">
              <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
              <span>Attached Documents &amp; Evidence Files</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
            {caseData.documents?.map(doc => (
              <div key={doc.id} style={{
                padding: '16px 18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={22} style={{ color: 'var(--accent-blue)' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text-main)' }}>{doc.document_name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                      Type: {doc.document_type} · By {doc.uploaded_by_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ATTACH DOCUMENT FORM */}
          <form onSubmit={handleAddDocument} style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: 'var(--text-main)' }}>+ Attach New Document</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
              <input
                required
                className="form-control"
                placeholder="Document name / reference..."
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
              />
              <select className="form-control" value={newDocType} onChange={(e) => setNewDocType(e.target.value)}>
                <option value="evidence">Evidence / Witness File</option>
                <option value="minutes">Panel Minutes / Roster</option>
                <option value="ruling">Official Ruling Letter</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <Upload size={14} />
              <span>Attach File</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: COMMUNICATIONS & NOTES */}
      {activeTab === 'communications' && (
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">
              <MessageSquare size={20} style={{ color: 'var(--accent-purple)' }} />
              <span>Communications &amp; Internal Notes Thread</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            {caseData.communications?.map(m => (
              <div key={m.id} style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: m.is_internal ? '#FFFBEB' : '#F8FAFC',
                border: m.is_internal ? '1px solid #FDE68A' : '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text-main)' }}>{m.sender_name}</span>
                    {m.is_internal && <span className="badge badge-medium" style={{ fontSize: 10 }}>Internal Note</span>}
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {m.message}
                </div>
              </div>
            ))}
          </div>

          {/* POST MESSAGE FORM */}
          <form onSubmit={handleAddCommunication} style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: 'var(--text-main)' }}>Post Message or Internal HR Note</h4>
            <div className="form-group">
              <textarea
                required
                rows={3}
                className="form-control"
                placeholder="Type your update, inquiry response, or internal investigation note..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--dhl-red)' }}
                />
                <span>Internal HR Note only (hidden from employee view)</span>
              </label>
              <button type="submit" className="btn btn-primary btn-sm">
                <Send size={14} />
                <span>Post Note</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: AI COPILOT CASE ANALYSIS */}
      {activeTab === 'ai_case' && (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-title">
              <Bot size={22} style={{ color: 'var(--dhl-yellow)' }} />
              <span>AI Case Strategy &amp; Risk Assessment</span>
            </div>
            <span className="ai-badge">
              <Sparkles size={12} style={{ marginRight: 4 }} />
              Automated Advisor
            </span>
          </div>

          <div style={{ background: 'rgba(255, 204, 0, 0.08)', border: '1px solid rgba(255, 204, 0, 0.25)', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--dhl-yellow)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
              Case Precedent Summary:
            </div>
            <div style={{ fontSize: 13.5, color: '#F1F5F9', lineHeight: 1.55 }}>
              This matter correlates with 3 historic shift-scheduling grievances in the Lagos Logistics Hub. Standard procedure recommends informal mediation before formal disciplinary panel convening.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', marginBottom: 6 }}>
                Recommended Action Plan:
              </div>
              <div style={{ fontSize: 13, color: '#FFFFFF', lineHeight: 1.5 }}>
                1. Verify night shift roster logs for August 10-14.<br />
                2. Convene informal bilateral review with shop steward.<br />
                3. Issue formal HR decision notice within 5 working days.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#FCA5A5', textTransform: 'uppercase', marginBottom: 6 }}>
                Compliance &amp; Risk Rating:
              </div>
              <div style={{ fontSize: 13, color: '#FFFFFF', lineHeight: 1.5 }}>
                • SLA Breach Risk: <strong style={{ color: '#FCA5A5' }}>Low (4 days remaining)</strong><br />
                • Union Escalation Risk: <strong>Moderate</strong><br />
                • Statutory Compliance: <strong>Verified</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE TRANSITION MODAL */}
      {isTransitionModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsTransitionModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <RotateCw size={18} style={{ color: 'var(--dhl-red)' }} />
                <span>Transition Case Stage</span>
              </div>
              <button onClick={() => setIsTransitionModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <form onSubmit={handleStageTransition} className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Target Stage</label>
                <select className="form-control" value={targetStage} onChange={(e) => setTargetStage(e.target.value)}>
                  {stagesList.map(stg => (
                    <option key={stg.key} value={stg.key}>{stg.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Stage Transition Rationale / Notes</label>
                <textarea
                  required
                  rows={4}
                  className="form-control"
                  placeholder="Record mandatory rationale for advancing this case to the selected stage..."
                  value={stageNotes}
                  onChange={(e) => setStageNotes(e.target.value)}
                />
              </div>
              <div className="modal-footer" style={{ padding: 0, background: 'none', border: 'none', marginTop: 20 }}>
                <button type="button" onClick={() => setIsTransitionModalOpen(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={isSubmittingStage} className="btn btn-primary">
                  {isSubmittingStage ? 'Advancing Stage…' : 'Confirm Stage Advance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
