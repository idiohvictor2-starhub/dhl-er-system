import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCases } from '../api/cases';

export default function CasesList() {
  const [cases, setCases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    listCases().then(setCases).catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;

  return (
    <div>
      <h2>Cases</h2>
      <table cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th>Type</th><th>Employee</th><th>Location</th><th>Stage</th><th>Deadline</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{c.case_type}</td>
              <td>{c.employee_id}</td>
              <td>{c.location}</td>
              <td>{c.current_stage}</td>
              <td>{c.deadline || '—'}</td>
              <td>
                <Link to={`/cases/${c.id}`}>{c.status}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
