import React, { useEffect, useState } from 'react';
import { irmsApi } from '../api/irms';
import { Bell, X, CheckCheck, AlertTriangle, ChevronRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, onSelectCase }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'sla'

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
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

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.is_read;
    if (filter === 'sla') return a.alert_type === 'sla_risk';
    return true;
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 75,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      />
      <div className="notification-drawer">
        {/* DRAWER HEADER */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-main)' }}>
              <Bell size={18} style={{ color: 'var(--dhl-red)' }} />
              <span>Live Operational Alerts</span>
              {unreadCount > 0 && (
                <span className="badge badge-urgent" style={{ fontSize: 10 }}>
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Automated SLA &amp; IR compliance triggers
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* FILTER BAR & BULK ACTIONS */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: filter === 'all' ? 'var(--text-main)' : '#F1F5F9',
                color: filter === 'all' ? '#FFFFFF' : 'var(--text-muted)'
              }}
            >
              All ({alerts.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: filter === 'unread' ? 'var(--dhl-red)' : '#F1F5F9',
                color: filter === 'unread' ? '#FFFFFF' : 'var(--text-muted)'
              }}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('sla')}
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: filter === 'sla' ? '#F59E0B' : '#F1F5F9',
                color: filter === 'sla' ? '#FFFFFF' : 'var(--text-muted)'
              }}
            >
              ⚠️ SLA Risks
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-blue)',
                fontSize: 11.5,
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Scanning alert queue…
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--accent-green)', margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-main)' }}>All clear</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>No alerts matching this filter criteria.</div>
            </div>
          ) : (
            filteredAlerts.map(a => {
              const isSla = a.alert_type === 'sla_risk';
              return (
                <div
                  key={a.id}
                  onClick={() => handleItemClick(a)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    background: a.is_read ? '#FFFFFF' : '#FEF2F2',
                    borderLeft: a.is_read ? '3px solid transparent' : isSla ? '3px solid var(--dhl-red)' : '3px solid var(--accent-blue)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className={`badge ${isSla ? 'badge-urgent' : 'badge-in_progress'}`} style={{ fontSize: 10 }}>
                      {isSla ? '⚠️ SLA Risk' : a.alert_type.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text-main)', marginBottom: 4, lineHeight: 1.35 }}>
                    {a.title}
                  </div>

                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {a.message}
                  </div>

                  {a.related_case_id && (
                    <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--dhl-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>Open Case Workspace</span>
                      <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
