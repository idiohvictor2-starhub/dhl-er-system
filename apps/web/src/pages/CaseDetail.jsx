import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCase, transitionStage } from '../api/cases';

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState(null);
  const [newStage, setNewStage] = useState('');

  function load() {
    getCase(id).then(setCaseData).catch((err) => setError(err.message));
  }

  useEffect(load, [id]);

  async function handleTransition(e) {
    e.preventDefault();
    try {
      await transitionStage(id, newStage);
      setNewStage('');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!caseData) return <p>Loading…</p>;

  return (
    <div>
      <h2>Case #{caseData.id} — {caseData.case_type}</h2>
      <p><strong>Employee:</strong> {caseData.employee_id} · <strong>Location:</strong> {caseData.location} · <strong>Department:</strong> {caseData.department}</p>
      <p><strong>Current stage:</strong> {caseData.current_stage} · <strong>Status:</strong> {caseData.status}</p>
      <p><strong>Deadline:</strong> {caseData.deadline || '—'}</p>

      <h3>Stage history</h3>
      <ul>
        {caseData.stage_history.map((h) => (
          <li key={h.id}>{h.stage} — entered {new Date(h.entered_at).toLocaleDateString()}{h.exited_at ? `, exited ${new Date(h.exited_at).toLocaleDateString()}` : ''}</li>
        ))}
      </ul>

      <form onSubmit={handleTransition} style={{ marginTop: 16 }}>
        <input placeholder="New stage" value={newStage} onChange={(e) => setNewStage(e.target.value)} />
        <button type="submit">Move to stage</button>
      </form>
    </div>
  );
}
