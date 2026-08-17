import React, { useState } from 'react';
import { irmsApi } from '../api/irms';

const CONCERN_TYPES = [
  { type: 'grievance', label: 'Formal Grievance', icon: '⚖️', desc: 'Workplace dispute, shift allocation, pay or contract condition dispute' },
  { type: 'concern', label: 'Workplace Concern / Health & Safety', icon: '⚠️', desc: 'Facility safety, ergonomics, harassment or environmental issue' },
  { type: 'query', label: 'HR Policy / Benefits Query', icon: '❓', desc: 'Clarification on policy, pensions, leave entitlements, or allowances' },
  { type: 'disciplinary', label: 'Disciplinary Response / Statement', icon: '📄', desc: 'Official written response to a query or panel hearing notice' },
  { type: 'union', label: 'Union / Collective Matter', icon: '🤝', desc: 'JCC representation issue, group welfare or collective bargaining item' }
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>
              {step === 4 ? 'Concern Registered Successfully' : 'Raise an Industrial Relations Concern'}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              {step < 4 ? `Step ${step} of 3 — Confidential & Structured Employee Intake` : 'Official Record Generated'}
            </p>
          </div>
          <button onClick={handleReset} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#64748B' }}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
                1. What type of matter would you like to report?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CONCERN_TYPES.map(t => (
                  <div
                    key={t.type}
                    onClick={() => setCaseType(t.type)}
                    style={{
                      border: caseType === t.type ? '2px solid #D40511' : '1px solid #E2E8F0',
                      background: caseType === t.type ? '#FEF2F2' : '#FFFFFF',
                      borderRadius: 8,
                      padding: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: '#0F172A' }}>{t.label}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="form-group">
                <label className="form-label">Subject / Headline *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Discrepancy in Night Shift Allowance Calculation"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Shift Scheduling & Overtime">Shift Scheduling &amp; Overtime</option>
                  <option value="Health, Safety & PPE">Health, Safety &amp; PPE</option>
                  <option value="Workplace Conduct & Fair Treatment">Workplace Conduct &amp; Fair Treatment</option>
                  <option value="Compensation & Benefits">Compensation &amp; Benefits</option>
                  <option value="Disciplinary Inquiry Response">Disciplinary Inquiry Response</option>
                  <option value="Appraisal Dispute">Appraisal Dispute</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description of Concern *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Provide objective facts, specific dates, shift details, and any persons involved..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Operating Location</label>
                  <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="Lagos Headquarters (Victoria Island)">Lagos Headquarters</option>
                    <option value="Lagos Airport Cargo Gateway (Murtala Muhammed)">Lagos Airport Gateway</option>
                    <option value="Lagos Apapa Port Logistics Hub">Lagos Apapa Port Hub</option>
                    <option value="Port Harcourt Trans-Amadi Hub">Port Harcourt Hub</option>
                    <option value="Abuja Central Delivery Depot">Abuja Central Depot</option>
                    <option value="Kano Mallam Aminu Airfreight Hub">Kano Airfreight Hub</option>
                    <option value="Ibadan Express Station">Ibadan Station</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="Operations & Ground Courier">Operations &amp; Ground Courier</option>
                    <option value="Warehouse & Sort Facility">Warehouse &amp; Sort Facility</option>
                    <option value="Fleet Maintenance & Transport">Fleet &amp; Transport</option>
                    <option value="Customs Clearance & Brokerage">Customs Clearance</option>
                    <option value="Customer Operations & Express Service">Customer Operations</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Urgency / Priority</label>
                  <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low (Standard SLA - 14 Days)</option>
                    <option value="medium">Medium (Standard SLA - 10 Days)</option>
                    <option value="high">High (Priority SLA - 5 Days)</option>
                    <option value="urgent">Urgent (Immediate Review - 48 Hours)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Confidentiality</label>
                  <select className="form-control" value={confidentiality} onChange={(e) => setConfidentiality(e.target.value)}>
                    <option value="standard">Standard (HR &amp; Line Manager)</option>
                    <option value="confidential">Strictly Confidential (HR Lead Only)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Attach Supporting Evidence (Optional)</label>
                <input
                  className="form-control"
                  placeholder="e.g. timesheet_screenshot.png or roster_email.pdf"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && createdCase && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                ✓
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                Case Successfully Logged
              </h3>
              <p style={{ color: '#64748B', fontSize: 13.5 }}>
                Your concern has been entered into the master IR registry and assigned an official tracking code.
              </p>

              <div style={{ background: '#F8FAFC', border: '2px dashed #E2E8F0', borderRadius: 10, padding: 16, margin: '20px 0' }}>
                <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Tracking Reference</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#D40511', marginTop: 4 }}>
                  {createdCase.case_number}
                </div>
                <div style={{ fontSize: 12, color: '#0F172A', marginTop: 6 }}>
                  Status: <strong>{createdCase.status}</strong> · Stage: <strong>{createdCase.current_stage}</strong>
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#94A3B8' }}>
                You will receive status notifications as this matter progresses through the investigative workflow.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 1 && (
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue to Details →
            </button>
          )}

          {step === 2 && (
            <>
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button className="btn btn-primary" disabled={!subject || !description} onClick={() => setStep(3)}>
                Continue to Organization &amp; SLA →
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button className="btn btn-outline" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button className="btn btn-danger" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? 'Submitting…' : 'Submit Formal Concern 🚀'}
              </button>
            </>
          )}

          {step === 4 && (
            <button className="btn btn-primary" onClick={handleReset}>
              Close &amp; Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
