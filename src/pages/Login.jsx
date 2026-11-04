import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, CheckSquare } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f6', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '40px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: '#eef2ff', borderRadius: '50%', color: '#4f46e5', marginBottom: '12px' }}>
            <CheckSquare size={32} />
          </div>
          <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.75rem' }}>Welcome Back</h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>Sign in to your task workspace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Email Address</label>
            <input type="email" required placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: '600' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;