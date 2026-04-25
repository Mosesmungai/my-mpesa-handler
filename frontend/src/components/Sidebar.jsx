import React from 'react';
import { LayoutDashboard, Settings, Activity, History, Shield, LogOut, ChevronRight } from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={22} />, label: 'Overview' },
    { id: 'systems', icon: <Shield size={22} />, label: 'Systems Manager' },
    { id: 'testing', icon: <Activity size={22} />, label: 'Testing Lab' },
    { id: 'logs', icon: <History size={22} />, label: 'Audit Logs' },
    { id: 'settings', icon: <Settings size={22} />, label: 'System Config' },
  ];

  return (
    <aside className="glass" style={{ width: '300px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', boxShadow: '0 0 15px var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={24} color="#000" />
        </div>
        <h2 style={{ fontSize: '1.4rem' }} className="text-gradient">Daraja Pro</h2>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '14px 18px', 
              borderRadius: '14px', 
              cursor: 'pointer',
              color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
              background: activeTab === item.id ? 'rgba(0, 255, 163, 0.08)' : 'transparent',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {item.icon}
              <span style={{ fontWeight: 500, fontSize: '1rem' }}>{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={16} />}
          </div>
        ))}
      </nav>

      <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>
            {user.username?.[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user.username}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
          </div>
        </div>
        <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }} onClick={() => window.location.reload()}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
