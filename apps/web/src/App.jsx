import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RaiseConcernModal from './components/RaiseConcernModal';
import NotificationDrawer from './components/NotificationDrawer';

import Dashboard from './pages/Dashboard';
import CasesList from './pages/CasesList';
import CaseDetail from './pages/CaseDetail';
import UnionWorkspace from './pages/UnionWorkspace';
import RedundancyTracker from './pages/RedundancyTracker';
import TrainingTracker from './pages/TrainingTracker';
import QuarterlyReportView from './pages/QuarterlyReportView';
import SystemAdminView from './pages/SystemAdminView';

import { getCurrentUser } from './api/auth';
import { irmsApi } from './api/irms';

export default function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    irmsApi.getAlerts()
      .then(alerts => setAlertCount(alerts.filter(a => !a.is_read).length))
      .catch(console.error);
  }, [currentUser]);

  function handleUserChange(newUser) {
    setCurrentUser(newUser);
  }

  function handleSelectCaseFromAlert(caseId) {
    navigate(`/cases/${caseId}`);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onOpenRaiseModal={() => setIsRaiseModalOpen(true)}
        alertCount={alertCount}
        onToggleAlerts={() => setIsAlertsOpen(prev => !prev)}
      />

      <NotificationDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectCase={handleSelectCaseFromAlert}
      />

      <main className="irms-container" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard currentUser={currentUser} onOpenRaiseModal={() => setIsRaiseModalOpen(true)} />} />
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} onOpenRaiseModal={() => setIsRaiseModalOpen(true)} />} />
          <Route path="/cases" element={<CasesList currentUser={currentUser} onOpenRaiseModal={() => setIsRaiseModalOpen(true)} />} />
          <Route path="/cases/:id" element={<CaseDetail currentUser={currentUser} />} />
          <Route path="/union" element={<UnionWorkspace currentUser={currentUser} />} />
          <Route path="/redundancy" element={<RedundancyTracker currentUser={currentUser} />} />
          <Route path="/training" element={<TrainingTracker currentUser={currentUser} />} />
          <Route path="/reports" element={<QuarterlyReportView currentUser={currentUser} />} />
          <Route path="/admin" element={<SystemAdminView currentUser={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <RaiseConcernModal
        isOpen={isRaiseModalOpen}
        onClose={() => setIsRaiseModalOpen(false)}
        currentUser={currentUser}
        onCaseCreated={(newCase) => {
          navigate(`/cases/${newCase.id}`);
        }}
      />
    </div>
  );
}
