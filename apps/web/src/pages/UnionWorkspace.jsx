import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { Users, Calendar, CheckSquare, FileText, Plus, Clock, Building2, CheckCircle2, RotateCw } from 'lucide-react';

export default function UnionWorkspace({ currentUser }) {
  const [data, setData] = useState({ meetings: [], actions: [], cba_negotiations: [] });
  const [loading, setLoading] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New meeting state
  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState('quarterly_jcc');
  const [location, setLocation] = useState('Lagos Headquarters Boardroom');
  const [agenda, setAgenda] = useState('');

  // New action state
  const [actionTitle, setActionTitle] = useState('');
  const [actionOwner, setActionOwner] = useState('');
  const [actionDueDate, setActionDueDate] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const res = await irmsApi.getUnionMeetings();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleScheduleMeeting(e) {
    e.preventDefault();
    try {
      await irmsApi.createUnionMeeting({ title, meeting_date: meetingDate, meeting_type: meetingType, location, agenda });
      setIsScheduleModalOpen(false);
      setTitle('');
      setMeetingDate('');
      setAgenda('');
      loadData();
    } catch (err) {
      alert('Error scheduling meeting: ' + err.message);
    }
  }

  async function handleAddAction(e) {
    e.preventDefault();
    if (!actionTitle) return;
    try {
      await irmsApi.addUnionAction({ action_title: actionTitle, owner_name: actionOwner, due_date: actionDueDate });
      setActionTitle('');
      setActionOwner('');
      setActionDueDate('');
      loadData();
    } catch (err) {
      alert('Error adding action: ' + err.message);
    }
  }

  async function handleToggleAction(id, currentStatus) {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await irmsApi.toggleUnionAction(id, nextStatus);
    loadData();
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RotateCw size={32} className="animate-spin" style={{ color: 'var(--dhl-yellow)', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Loading Union &amp; JCC Workspace…</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Connecting to Collective Bargaining &amp; Joint Consultative Committee Registry</div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO TITLE SECTION */}
      <div className="page-hero-header">
        <div>
          <h1 className="hero-heading">Union &amp; JCC Bilateral Workspace</h1>
          <p className="hero-tagline">
            Joint Consultative Committee governance, bilateral meetings, and Collective Bargaining Agreement (CBA) tracking.
          </p>
        </div>

        <button onClick={() => setIsScheduleModalOpen(true)} className="btn btn-primary">
          <Plus size={16} strokeWidth={3} />
          <span>Schedule Bilateral Session</span>
        </button>
      </div>

      {/* MEETINGS GRID */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <Calendar size={20} style={{ color: 'var(--accent-blue)' }} />
            <span>Scheduled &amp; Recent Bilateral Meetings</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {data.meetings?.map(m => (
            <div key={m.id} style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="badge badge-union" style={{ fontSize: 10 }}>
                  {m.meeting_type?.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  📅 {m.meeting_date}
                </span>
              </div>

              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
                {m.title}
              </h4>

              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={14} />
                <span>{m.location}</span>
              </div>

              {m.agenda && (
                <div style={{ fontSize: 13, color: 'var(--text-main)', background: '#F8FAFC', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <strong>Agenda:</strong> {m.agenda}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ACTION TRACKER SECTION */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <CheckSquare size={20} style={{ color: 'var(--accent-green)' }} />
            <span>Joint Action Item Commitments</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {data.actions?.map(a => {
            const isCompleted = a.status === 'completed';
            return (
              <div key={a.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: isCompleted ? '#ECFDF5' : '#F8FAFC',
                border: isCompleted ? '1px solid #A7F3D0' : '1px solid var(--border-light)'
              }}>
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
                      Assigned to: <strong>{a.owner_name}</strong> {a.due_date && `· Due: ${a.due_date}`}
                    </div>
                  </div>
                </div>
                <span className={`badge ${isCompleted ? 'badge-closed' : 'badge-in_progress'}`}>
                  {a.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* ADD ACTION FORM */}
        <form onSubmit={handleAddAction} style={{ background: '#F8FAFC', padding: 20, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: 'var(--text-main)' }}>+ Add Joint Committee Action Item</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
            <input
              required
              className="form-control"
              placeholder="Action title..."
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
            />
            <input
              className="form-control"
              placeholder="Assignee Lead"
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

      {/* SCHEDULE MODAL */}
      {isScheduleModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsScheduleModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Calendar size={18} style={{ color: 'var(--dhl-red)' }} />
                <span>Schedule Bilateral Session</span>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleScheduleMeeting} className="modal-body">
              <div className="form-group">
                <label className="form-label">Session Title *</label>
                <input required className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q3 Bilateral Review on Transport Allowances" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Meeting Date</label>
                  <input type="date" required className="form-control" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Session Category</label>
                  <select className="form-control" value={meetingType} onChange={(e) => setMeetingType(e.target.value)}>
                    <option value="quarterly_jcc">Quarterly JCC Review</option>
                    <option value="cba_negotiation">CBA Negotiation</option>
                    <option value="emergency_dialogue">Emergency Dialogue</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Venue / Room</label>
                <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Proposed Agenda Summary</label>
                <textarea rows={3} className="form-control" value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="List core agenda items..." />
              </div>
              <div className="modal-footer" style={{ padding: 0, background: 'none', border: 'none', marginTop: 20 }}>
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
