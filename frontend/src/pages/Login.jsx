import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Globe } from 'lucide-react';
import api from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, formData);
      
      if (isLogin) {
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
      } else {
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ width: '400px', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock color="#000" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isLogin ? 'Enter your credentials to access the gateway' : 'Create an account to manage your APIs'}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Username</label>
              <input 
                type="text" 
                required
                className="btn btn-outline" 
                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} 
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
          )}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                required
                className="btn btn-outline" 
                style={{ width: '100%', padding: '12px 12px 12px 42px', background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              required
              className="btn btn-outline" 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', textAlign: 'left' }} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: '48px' }}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: '12px', height: '48px' }}>
          <Globe size={20} />
          Sign in with Google
        </button>

        <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
