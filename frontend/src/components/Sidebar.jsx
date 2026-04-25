import React from 'react';
import { LayoutDashboard, Settings, Activity, History, Shield, LogOut } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'systems', icon: <Shield size={20} />, label: 'Systems' },
    { id: 'testing', icon: <Activity size={20} />, label: 'Testing Panel' },
    { id: 'logs', icon: <History size={20} />, label: 'Transaction Logs' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar glass" style={{ margin: '20px', height: 'calc(100vh - 40px)', width: '260px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <div className="logo" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
        <h2 style={{ fontSize: '1.2rem' }}>Daraja Gateway</h2>
      </div>

        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginBottom: '4px',
              color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
              background: activeTab === item.id ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            {item.icon}
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
