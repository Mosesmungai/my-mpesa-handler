import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Systems from './pages/Systems';
import TestingPanel from './pages/TestingPanel';
import Logs from './pages/Logs';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="app-container">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'systems' && <Systems user={user} />}
        {activeTab === 'testing' && <TestingPanel user={user} />}
        {activeTab === 'logs' && <Logs user={user} />}
        {activeTab === 'settings' && <div className="glass shadow-glow" style={{ padding: '60px', textAlign: 'center' }}>
          <Settings size={48} style={{ margin: '0 auto 20px', color: 'var(--primary)' }} />
          <h2>System Configuration</h2>
          <p>Maintenance mode and global rate limits are coming soon.</p>
        </div>}
      </main>
    </div>
  );
}

export default App;
