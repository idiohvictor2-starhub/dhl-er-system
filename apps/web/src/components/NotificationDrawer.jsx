import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';

export default function NotificationDrawer({ isOpen, onClose, onSelectCase }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      irmsApi.getAlerts()
        .then(setAlerts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleMarkAllRead() {
    await irmsApi.markAllAlertsRead();
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
  }

  async function handleItemClick(alert) {
    if (!alert.is_read) {
      await irmsApi.markAlertRead(alert.id);
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, is_read: true } : a));
    }
    if (alert.related_case_id && onSelectCase) {
      onSelectCase(alert.related_case_id);
      onClose();
    }
  }

  return (
    <div className="notification-drawer">
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
        <div style={{ fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          🔔 Operational Notifications
        </div>
        <button
          onClick={handleMarkAllRead}
          style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
        >
          Mark all read
        </button>
      </div>

      <div style={{ padding: '8px 0' }}>
        {loading ? (
          <p style={{ padding: 16, fontSize: 13, color: '#64748B' }}>Loading notifications…</p>
        ) : alerts.length === 0 ? (
          <p style={{ padding: 16, fontSize: 13, color: '#64748B', textAlign: 'center' }}>No active alerts.</p>
        ) : (
          alerts.map(a => (
            <div
              key={a.id}
              onClick={() => handleItemClick(a)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #F1F5F9',
                cursor: 'pointer',
                background: a.is_read ? '#FFFFFF' : '#FEF2F2',
                transition: 'background 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: a.alert_type === 'sla_risk' ? '#DC2626' : '#2563EB' }}>
                  {a.alert_type.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 4 }}>
                {a.title}
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                {a.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
