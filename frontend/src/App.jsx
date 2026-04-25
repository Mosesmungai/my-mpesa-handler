import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <main>
        <Dashboard user={user} />
      </main>
    </div>
  );
}

export default App;
