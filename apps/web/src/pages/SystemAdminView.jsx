import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

export default function SystemAdminView({ currentUser }) {
  const [usersData, setUsersData] = useState({ users: [], locations: [], departments: [] });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [uData, aLogs] = await Promise.all([
          irmsApi.getUsersAndMetadata(),
          irmsApi.getAuditLogs()
        ]);
        setUsersData(uData);
        setAuditLogs(aLogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading system governance &amp; audit trails…</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1>System Administration &amp; Governance</h1>
          <div className="page-subtitle">
            Role-Based Access Control (RBAC), user directory, organizational metadata, and immutable compliance audit trail.
          </div>
        </div>
      </div>

      {/* USER DIRECTORY & RBAC ROLES */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <span>👥</span> Enterprise User Directory &amp; RBAC Roles
          </div>
          <span style={{ fontSize: 12, color: '#64748B' }}>Total Users: {usersData.users?.length || 0}</span>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role Title</th>
                <th>RBAC Level</th>
                <th>Department</th>
                <th>Assigned Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {usersData.users?.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.employee_id}</strong></td>
                  <td><span style={{ fontWeight: 700 }}>{u.full_name}</span></td>
                  <td><code>{u.email}</code></td>
                  <td>{u.role_title || 'Staff Member'}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'sys_admin' ? 'urgent' : u.role === 'er_manager' ? 'high' : 'open'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department}</td>
                  <td>{u.location.split('(')[0]}</td>
                  <td><span className="badge badge-closed">{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IMMUTABLE AUDIT LOG STREAM */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <span>🔒</span> Immutable Compliance Audit Trail
          </div>
          <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 700 }}>✓ Append-Only Integrity Verified</span>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Action Performed</th>
                <th>Actor</th>
                <th>Entity Type</th>
                <th>Target Reference</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td><code>#LOG-{String(log.id).padStart(4, '0')}</code></td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>
                    <strong style={{ color: '#0F172A', fontSize: 12.5 }}>{log.action}</strong>
                  </td>
                  <td>{log.user_name}</td>
                  <td><span className="badge badge-grievance">{log.entity_type}</span></td>
                  <td><code>{log.entity_id}</code></td>
                  <td><span style={{ color: '#64748B', fontSize: 11 }}>{log.ip_address}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
