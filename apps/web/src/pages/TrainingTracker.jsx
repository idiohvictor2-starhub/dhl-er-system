import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

export default function TrainingTracker({ currentUser }) {
  const [data, setData] = useState({ programs: [], completions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    irmsApi.getTrainingData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCompleteProgram(programId) {
    await irmsApi.recordTrainingCompletion({
      program_id: programId,
      user_name: currentUser?.name || 'Staff Member',
      department: currentUser?.department || 'Operations',
      location: currentUser?.location || 'Lagos',
      score: 96
    });
    const updated = await irmsApi.getTrainingData();
    setData(updated);
    alert('Training certificate recorded successfully!');
  }

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>Loading Training &amp; Capacity Builder records…</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>Industrial Relations Training &amp; Compliance Hub</h1>
          <div className="page-subtitle">
            Capacity building across grievance handling, disciplinary procedures, investigation standards, and labor relations.
          </div>
        </div>
      </div>

      {/* TRAINING PROGRAMS GRID */}
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Core Industrial Relations Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
        {data.programs?.map(p => (
          <div key={p.id} className="irms-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge badge-grievance">{p.category}</span>
                <span style={{ fontSize: 11, color: '#64748B' }}>Mandatory</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: 6 }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.5 }}>
                {p.description}
              </p>
            </div>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Roles: {p.mandatory_for_roles}</span>
              <button onClick={() => handleCompleteProgram(p.id)} className="btn btn-sm btn-primary">
                🎓 Complete Module
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CERTIFICATIONS & COMPLETIONS REGISTRY */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <span>📜</span> Recent Certifications &amp; Completed Records
          </div>
          <span style={{ fontSize: 12, color: '#64748B' }}>Total Completed: {data.completions?.length || 0}</span>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Department</th>
                <th>Location</th>
                <th>Score</th>
                <th>Completion Date</th>
                <th>Expiry / Recertification</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.completions?.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.user_name}</strong></td>
                  <td>{c.department}</td>
                  <td>{c.location.split('(')[0]}</td>
                  <td><span style={{ fontWeight: 800, color: '#16A34A' }}>{c.score}%</span></td>
                  <td>📅 {c.completion_date}</td>
                  <td>📅 {c.expiry_date}</td>
                  <td><span className="badge badge-closed">✓ Certified</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
