
import React, { useState } from 'react';
import { UserRole } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import IncidentForm from './components/IncidentForm';
import IncidentList from './components/IncidentList';
import UserManagement from './components/UserManagement';

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
