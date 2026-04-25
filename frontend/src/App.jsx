import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Systems from './pages/Systems';
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
        {activeTab === 'testing' && <div className="glass" style={{ padding: '40px' }}>Testing Panel Coming Soon...</div>}
        {activeTab === 'logs' && <div className="glass" style={{ padding: '40px' }}>Transaction Logs Coming Soon...</div>}
      </main>
    </div>
  );
}

export default App;
