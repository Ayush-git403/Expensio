import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e10' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="serif" style={{ fontSize: 38, color: '#c9a96e' }}>Expensio</span>
          <p style={{ color: '#666', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>
        <div style={{ background: '#13131a', border: '1px solid #2e2e38', borderRadius: 16, padding: 32 }}>
          {error && (
            <div style={{ background: '#3e1a1a', border: '1px solid #e05c5c', borderRadius: 8, padding: '10px 14px', color: '#e05c5c', fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 7, letterSpacing: '0.04em' }}>EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com" style={{ width: '100%' }} required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#666', marginBottom: 7, letterSpacing: '0.04em' }}>PASSWORD</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••" style={{ width: '100%' }} required />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 13, background: '#c9a96e', border: 'none', borderRadius: 10, color: '#0e0e10', fontSize: 15, fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#c9a96e', textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}