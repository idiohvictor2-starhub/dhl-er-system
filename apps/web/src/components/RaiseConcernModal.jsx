import React, { useState } from 'react';
import { irmsApi } from '../api/irms';
import { Scale, AlertTriangle, HelpCircle, FileText, Users, X, ArrowRight, ArrowLeft, CheckCircle2, Check, ShieldCheck } from 'lucide-react';

const CONCERN_TYPES = [
  { type: 'grievance', label: 'Formal Grievance', icon: <Scale size={22} style={{ color: '#D40511' }} />, desc: 'Workplace dispute, shift allocation, pay or contract condition dispute' },
  { type: 'concern', label: 'Workplace Health & Safety', icon: <AlertTriangle size={22} style={{ color: '#F59E0B' }} />, desc: 'Facility safety, ergonomics, equipment defect, or harassment' },
  { type: 'query', label: 'HR Policy & Benefits Query', icon: <HelpCircle size={22} style={{ color: '#2563EB' }} />, desc: 'Clarification on policy, pensions, leave entitlements, or allowances' },
  { type: 'disciplinary', label: 'Disciplinary Statement', icon: <FileText size={22} style={{ color: '#8B5CF6' }} />, desc: 'Official written response to a query or panel hearing notice' },
  { type: 'union', label: 'Union / Collective Matter', icon: <Users size={22} style={{ color: '#06B6D4' }} />, desc: 'JCC representation issue, group welfare, or collective bargaining item' }
];

export default function RaiseConcernModal({ isOpen, onClose, currentUser, onCaseCreated }) {
  const [step, setStep] = useState(1);
  const [caseType, setCaseType] = useState('grievance');
  const [category, setCategory] = useState('Shift Scheduling & Overtime');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(currentUser?.location || 'Lagos Headquarters (Victoria Island)');
  const [department, setDepartment] = useState(currentUser?.department || 'Operations & Ground Courier');
  const [priority, setPriority] = useState('medium');
  const [confidentiality, setConfidentiality] = useState('standard');
  const [documentName, setDocumentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCase, setCreatedCase] = useState(null);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        case_type: caseType,
        category: category || 'General Workplace Concern',
        subject: subject || `${caseType.toUpperCase()} - ${category}`,
        description,
        employee_id: currentUser?.employee_id || 'DHL-EMP-1042',
        employee_name: currentUser?.name || 'Staff Member',
        department,
        location,
        priority,
        confidentiality
      };
      const result = await irmsApi.createCase(payload);
      setCreatedCase(result);
      if (onCaseCreated) onCaseCreated(result);
      setStep(4); // Success step
    } catch (err) {
      alert('Failed to submit concern: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setStep(1);
    setSubject('');
    setDescription('');
    setCreatedCase(null);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleReset}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="sidebar-logo-badge" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 6 }}>DHL</span>
            <span>Raise an Industrial Relations Matter / Concern</span>
          </div>
          <button
            onClick={handleReset}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div style={{ background: '#F1F5F9', height: 4, width: '100%', position: 'relative' }}>
          <div
            style={{
              background: 'var(--dhl-red)',
              height: '100%',
              width: step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>

        {/* MODAL BODY */}
        <div className="modal-body">
          {/* STEP 1: SELECT MATTER TYPE */}
          {step === 1 && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>
                Step 1: Select Type of Matter
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Choose the classification that best describes the workplace item you are logging into the DHL registry.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                {CONCERN_TYPES.map(item => {
                  const selected = caseType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setCaseType(item.type)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: selected ? '2px solid var(--dhl-red)' : '1px solid var(--border-light)',
                        background: selected ? 'var(--dhl-red-subtle)' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: 46,
                        height: 46,
                        borderRadius: 'var(--radius-md)',
                        background: selected ? '#FFFFFF' : '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-xs)',
                        border: '1px solid var(--border-light)'
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 14.5, color: selected ? 'var(--dhl-red)' : 'var(--text-main)' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
                          {item.desc}
                        </div>
                      </div>
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: selected ? '6px solid var(--dhl-red)' : '2px solid #CBD5E1',
                        background: '#FFFFFF'
                      }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 26, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-primary"
                >
                  <span>Continue to Details</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & SUMMARY */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>
                Step 2: Subject, Category &amp; Location
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Provide high-level context regarding the department, location, and specific issue.
              </p>

              <div className="form-group">
                <label className="form-label">Subject Headline *</label>
                <input
                  required
                  className="form-control"
                  placeholder="e.g. Overtime allocation dispute in Night Shift sorting hub"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Specific Category</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Shift Scheduling, Safety, Transport"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Urgency / Priority SLA</label>
                  <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low (Standard 14-day SLA)</option>
                    <option value="medium">Medium (Standard 7-day SLA)</option>
                    <option value="high">High (48-hour SLA)</option>
                    <option value="urgent">Urgent Escalation (24-hour SLA)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Operating Location / Hub</label>
                  <input
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <span>Continue to Statement</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: NARRATIVE & SUBMISSION */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-main)', marginBottom: 4 }}>
                Step 3: Statement of Facts &amp; Desired Resolution
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Detail the events clearly. All entries are recorded securely according to DHL IR governance policies.
              </p>

              <div className="form-group">
                <label className="form-label">Detailed Narrative / Statement *</label>
                <textarea
                  required
                  rows={5}
                  className="form-control"
                  placeholder="Explain what happened, dates, individuals involved, and the specific resolution or remedy you are requesting..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Supporting Evidence / Attachment Ref (Optional)</label>
                <input
                  className="form-control"
                  placeholder="e.g. Roster_Schedule_Aug14.pdf or Signed_Witness_Statement.docx"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confidentiality Tier</label>
                <select className="form-control" value={confidentiality} onChange={(e) => setConfidentiality(e.target.value)}>
                  <option value="standard">Standard Case Management (Assigned HR &amp; Line Lead)</option>
                  <option value="strictly_confidential">Strictly Confidential (ER Director &amp; Designated Investigator Only)</option>
                </select>
              </div>

              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: 12.5,
                color: '#92400E',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                <ShieldCheck size={18} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>DHL IR Transparency Guarantee:</strong> Upon submission, you will receive a unique Case Ref ID, automated SLA milestone tracking, and assigned HR investigator contact.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-outline"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-danger"
                >
                  <Check size={16} strokeWidth={3} />
                  <span>{isSubmitting ? 'Submitting & Registering Case…' : 'Submit Formal Concern'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '28px 16px' }}>
              <div style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'var(--accent-green-bg)',
                border: '2px solid var(--accent-green-border)',
                color: 'var(--accent-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 18
              }}>
                <CheckCircle2 size={38} />
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                Matter Logged Successfully!
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 460, margin: '0 auto 24px' }}>
                Your case has been registered in the DHL IRMS Central Registry and assigned an SLA target date.
              </p>

              {createdCase && (
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: 18,
                  maxWidth: 400,
                  margin: '0 auto 26px',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Case Ref ID:</span>
                    <strong style={{ color: 'var(--dhl-red)', fontSize: 14.5 }}>{createdCase.case_number}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Category:</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{createdCase.category}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>SLA Target:</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-main)' }}>{createdCase.sla_due_date || '7 Business Days'}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleReset}
                className="btn btn-primary"
                style={{ padding: '10px 28px' }}
              >
                <span>Go to Case Workspace</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
