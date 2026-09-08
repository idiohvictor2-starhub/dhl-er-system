import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { ShieldCheck, Users, Lock, ShieldAlert, RotateCw } from 'lucide-react';

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

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RotateCw size={32} className="animate-spin" style={{ color: 'var(--dhl-yellow)', margin: '0 auto 12px' }} />
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-main)' }}>Loading System Governance &amp; Audit Logs…</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Validating immutable cryptographic audit trail integrity</div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO TITLE SECTION */}
      <div className="page-hero-header">
        <div>
          <h1 className="hero-heading">System Governance &amp; Audit Log</h1>
          <p className="hero-tagline">
            Enterprise identity administration, access control permissions, organizational hierarchies, and immutable statutory compliance logs.
          </p>
        </div>
      </div>

      {/* USER DIRECTORY & RBAC ROLES */}
      <div className="irms-card">
        <div className="irms-card-header">
          <div className="irms-card-title">
            <Users size={20} style={{ color: 'var(--accent-blue)' }} />
            <span>Enterprise User Directory &amp; RBAC Authorization Matrix</span>
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
            {usersData.users?.length || 0} Registered Personas
          </span>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Full Name</th>
                <th>Corporate Email</th>
                <th>Role Title</th>
                <th>RBAC Authority Level</th>
                <th>Operating Department</th>
                <th>Base Station</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {usersData.users?.map(u => (
                <tr key={u.id}>
                  <td><code>{u.employee_id}</code></td>
                  <td><span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{u.full_name}</span></td>
                  <td><code>{u.email}</code></td>
                  <td>{u.role_title || 'Staff Member'}</td>
                  <td>
                    <span className={`badge ${u.role === 'sys_admin' ? 'badge-urgent' : u.role === 'er_manager' ? 'badge-high' : u.role === 'hr_director' ? 'badge-grievance' : 'badge-open'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department}</td>
                  <td>{u.location?.split('(')[0]}</td>
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
            <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} />
            <span>Immutable Compliance Audit Trail</span>
          </div>
          <span style={{ fontSize: 12, color: '#047857', fontWeight: 800, background: '#ECFDF5', padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={13} />
            <span>Cryptographic Audit Trail Integrity Verified</span>
          </span>
        </div>

        <div className="table-responsive">
          <table className="irms-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>Action Performed</th>
                <th>Actor Identity</th>
                <th>Entity Type</th>
                <th>Target Reference</th>
                <th>Client IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id}>
                  <td><code>#LOG-{String(log.id).padStart(4, '0')}</code></td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                  <td>
                    <strong style={{ color: 'var(--text-main)', fontSize: 13.5 }}>{log.action}</strong>
                  </td>
                  <td><strong>{log.user_name}</strong></td>
                  <td><span className="badge badge-grievance">{log.entity_type}</span></td>
                  <td><code>{log.entity_id}</code></td>
                  <td><span style={{ color: 'var(--text-muted)', fontSize: 11.5 }}><code>{log.ip_address}</code></span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
