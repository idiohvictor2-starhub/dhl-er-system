import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

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
      alert('Error: ' + err.message);
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
      alert('Error: ' + err.message);
    }
  }

  async function handleToggleAction(id, currentStatus) {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await irmsApi.toggleUnionAction(id, nextStatus);
    loadData();
  }

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>Loading Union &amp; JCC records…</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Union &amp; Joint Consultative Committee (JCC) Hub</h1>
          <div className="page-subtitle">
            Bilateral management of union consultations, JCC meetings, action points, and Collective Bargaining Agreements.
          </div>
        </div>

        <button onClick={() => setIsScheduleModalOpen(true)} className="btn btn-danger">
          ➕ Convene JCC Meeting
        </button>
      </div>

      {/* CBA NEGOTIATION PIPELINE CARD */}
      <div className="irms-card" style={{ borderLeft: '4px solid #7C3AED' }}>
        <div className="irms-card-header">
          <div className="irms-card-title">
            <span>📜</span> Active National Collective Bargaining Agreement (CBA) Review
          </div>
          <span className="badge badge-in_progress">Negotiation Stage 2</span>
        </div>

        {data.cba_negotiations?.map(cba => (
          <div key={cba.id}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 0 }}>{cba.title}</h3>
            <p style={{ color: '#475569', fontSize: 13.5, marginBottom: 12 }}>{cba.proposal_summary}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: '#F8FAFC', padding: 12, borderRadius: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>UNION LEAD REP</span>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{cba.union_rep_lead}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>MANAGEMENT LEAD</span>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{cba.management_lead_name}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 700 }}>TARGET EFFECTIVE DATE</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#2563EB' }}>📅 {cba.effective_date}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#0F172A', marginTop: 10, background: '#EFF6FF', padding: 8, borderRadius: 6 }}>
              💡 Status: <strong>{cba.notes}</strong>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        {/* JCC MEETINGS SESSIONS */}
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">
              <span>📅</span> JCC &amp; Consultative Sessions
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.meetings?.map(m => (
              <div key={m.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>{m.title}</span>
                  <span className={`badge badge-${m.status}`}>{m.status}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
                  📅 {new Date(m.meeting_date).toLocaleDateString()} · 📍 {m.location}
                </div>
                <div style={{ fontSize: 12.5, color: '#334155', background: '#FFFFFF', padding: 10, borderRadius: 6, border: '1px solid #E2E8F0', marginBottom: 8 }}>
                  <strong>Agenda:</strong> {m.agenda}
                </div>
                {m.minutes && (
                  <div style={{ fontSize: 12, color: '#166534', background: '#F0FDF4', padding: 8, borderRadius: 6 }}>
                    ✓ <strong>Minutes Recorded:</strong> {m.minutes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* UNION ACTION POINTS TRACKER */}
        <div className="irms-card">
          <div className="irms-card-header">
            <div className="irms-card-title">
              <span>⚡</span> Bilateral Action Points Tracker
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            {data.actions?.map(act => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                  borderRadius: 6,
                  background: act.status === 'completed' ? '#F0FDF4' : '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  marginBottom: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={act.status === 'completed'}
                    onChange={() => handleToggleAction(act.id, act.status)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, textDecoration: act.status === 'completed' ? 'line-through' : 'none' }}>
                      {act.action_title}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      Owner: {act.owner_name} · Due: 📅 {act.due_date}
                    </div>
                  </div>
                </div>
                <span className={`badge badge-${act.status}`}>{act.status}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddAction} style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 8 }}>+ Log New Action Point</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 8, alignItems: 'flex-end' }}>
              <input
                className="form-control"
                placeholder="Action summary..."
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
                required
              />
              <input
                className="form-control"
                placeholder="Owner"
                value={actionOwner}
                onChange={(e) => setActionOwner(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ height: 38 }}>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {isScheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Convene JCC / Consultative Session</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleScheduleMeeting}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Meeting Title *</label>
                  <input className="form-control" placeholder="e.g. Q4 National JCC Session" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Meeting Type</label>
                  <select className="form-control" value={meetingType} onChange={(e) => setMeetingType(e.target.value)}>
                    <option value="quarterly_jcc">Quarterly Joint Consultative Committee</option>
                    <option value="safety_committee">Health, Safety &amp; Environment Committee</option>
                    <option value="cba_negotiation">CBA &amp; Welfare Negotiation</option>
                    <option value="emergency_consultation">Emergency Grievance Consultation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date &amp; Time *</label>
                  <input type="datetime-local" className="form-control" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Boardroom</label>
                  <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Agenda Items</label>
                  <textarea className="form-control" rows={3} placeholder="1. Item one; 2. Item two..." value={agenda} onChange={(e) => setAgenda(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Schedule Session 📅</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
