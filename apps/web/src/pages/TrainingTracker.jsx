import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { GraduationCap, Award, CheckCircle2, Clock, BookOpen, RotateCw, Building2 } from 'lucide-react';

export default function TrainingTracker({ currentUser }) {
  const [data, setData] = useState({ programs: [], completions: [] });
  const [loading, setLoading] = useState(true);
  const [recordingId, setRecordingId] = useState(null);

  useEffect(() => {
    irmsApi.getTrainingData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCompleteProgram(programId) {
    setRecordingId(programId);
    try {
      await irmsApi.recordTrainingCompletion({
        program_id: programId,
        user_name: currentUser?.name || 'Staff Member',
        department: currentUser?.department || 'Operations',
        location: currentUser?.location || 'Lagos',
        score: 96
      });
      const updated = await irmsApi.getTrainingData();
      setData(updated);
      alert('Training certificate recorded and accredited to employee record successfully!');
    } catch (err) {
      alert('Error recording completion: ' + err.message);
    } finally {
      setRecordingId(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RotateCw size={32} className="animate-spin" style={{ color: 'var(--dhl-yellow)', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Loading Capability Academy…</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Connecting to DHL Industrial Relations Academy registry</div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO TITLE SECTION */}
      <div className="page-hero-header">
        <div>
          <h1 className="hero-heading">Capability Academy &amp; Certification</h1>
          <p className="hero-tagline">
            Mandatory capability programs across dispute resolution, statutory disciplinary standards, union negotiations, and safety compliance.
          </p>
        </div>
      </div>

      {/* TRAINING MODULES GRID */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <GraduationCap size={20} style={{ color: 'var(--dhl-yellow)' }} />
            <span>Accredited IR Training Curriculum</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {data.programs?.map(p => {
            const hasCompleted = data.completions?.some(c => c.program_id === p.id);
            return (
              <div key={p.id} style={{
                padding: '22px',
                borderRadius: 'var(--radius-lg)',
                border: hasCompleted ? '1.5px solid #A7F3D0' : '1px solid var(--border-light)',
                background: hasCompleted ? '#ECFDF5' : '#FFFFFF',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span className="badge badge-query" style={{ fontSize: 10 }}>
                      {p.target_role || 'All Managers'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={13} />
                      <span>{p.duration_hours || 4} Hours</span>
                    </span>
                  </div>

                  <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
                    {p.title}
                  </h4>

                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 18 }}>
                    {p.description}
                  </p>
                </div>

                <div>
                  {hasCompleted ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontWeight: 800, fontSize: 13 }}>
                      <CheckCircle2 size={18} />
                      <span>Certified &amp; Accredited</span>
                    </div>
                  ) : (
                    <button
                      disabled={recordingId === p.id}
                      onClick={() => handleCompleteProgram(p.id)}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      <Award size={16} />
                      <span>{recordingId === p.id ? 'Recording Completion…' : 'Take Module &amp; Certify'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ACADEMY COMPLETIONS LOG */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <Award size={20} style={{ color: 'var(--accent-green)' }} />
            <span>Certified Manager Compliance Log</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Station Hub</th>
                <th>Department</th>
                <th>Completed Module</th>
                <th>Score</th>
                <th>Accreditation Date</th>
              </tr>
            </thead>
            <tbody>
              {data.completions?.map((c, i) => (
                <tr key={i}>
                  <td><strong style={{ color: 'var(--text-main)', fontSize: 13.5 }}>{c.user_name}</strong></td>
                  <td>{c.location}</td>
                  <td>{c.department}</td>
                  <td>{c.program_title || 'IR Fundamentals'}</td>
                  <td><span className="badge badge-closed">{c.score}% Pass</span></td>
                  <td>{new Date(c.completed_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
