import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Systems from './pages/Systems';
import TestingPanel from './pages/TestingPanel';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });

  const handleSetUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setUser(userData);
  };

  const handleSetActiveTab = (tab) => {
    localStorage.setItem('activeTab', tab);
    setActiveTab(tab);
  };

  const handleLogout = () => {
    handleSetUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleSetUser} />;
  }

  return (
    <div className="app-container">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={handleSetActiveTab} onLogout={handleLogout} />
      <main>
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'systems' && <Systems user={user} />}
        {activeTab === 'testing' && <TestingPanel user={user} />}
        {activeTab === 'logs' && <Logs user={user} />}
        {activeTab === 'settings' && <Settings user={user} />}
      </main>
    </div>
  );
}

export default App;
