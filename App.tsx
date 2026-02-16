
import React, { useState } from 'react';
import { UserRole } from './types.ts';
import Login from './components/Login.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './components/Dashboard.tsx';
import IncidentForm from './components/IncidentForm.tsx';
import IncidentList from './components/IncidentList.tsx';
import UserManagement from './components/UserManagement.tsx';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.ANONYMOUS) {
      setCurrentView('new-report');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
      case 'reports':
        return <IncidentList userRole={userRole} />;
      case 'users':
        return <UserManagement />;
      case 'new-report':
        return (
          <IncidentForm 
            userRole={userRole} 
            onSuccess={() => {
              if (userRole === UserRole.ANONYMOUS) {
                alert('✅ Report submitted successfully. School staff will review this.');
              } else {
                alert('Report logged successfully.');
                setCurrentView('reports');
              }
            }} 
          />
        );
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <Layout 
      userRole={userRole} 
      onLogout={handleLogout} 
      currentView={currentView}
      setCurrentView={setCurrentView}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
