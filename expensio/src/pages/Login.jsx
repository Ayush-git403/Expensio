import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWindowSize } from '../hooks/useWindowSize';
import API from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { dark, theme } = useTheme();
  const { isMobile } = useWindowSize();
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

  const inputStyle = {
    width: '100%',
    background: theme.inputBg,
    border: `1px solid ${theme.cardBorder}`,
    color: theme.textPrimary,
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    colorScheme: dark ? 'dark' : 'light'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      transition: 'background 0.3s'
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 36 }}>
          <span className="serif" style={{
            fontSize: isMobile ? 36 : 42,
            color: theme.accent
          }}>
            Expensio
          </span>
          <p style={{
            color: theme.textPrimary, opacity: 0.6,
            fontSize: 14, marginTop: 8
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: isMobile ? 16 : 20,
          padding: isMobile ? '24px 20px' : '36px 32px',
          transition: 'background 0.3s'
        }}>

          {error && (
            <div style={{
              background: theme.highlight + '22',
              border: `1px solid ${theme.highlight}`,
              borderRadius: 10, padding: '10px 14px',
              color: theme.highlight,
              fontSize: 13, marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: 'block', fontSize: 11,
                color: theme.textPrimary, opacity: 0.6,
                marginBottom: 7, letterSpacing: '0.06em',
                fontWeight: 500
              }}>
                EMAIL
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block', fontSize: 11,
                color: theme.textPrimary, opacity: 0.6,
                marginBottom: 7, letterSpacing: '0.06em',
                fontWeight: 500
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: isMobile ? '14px' : '13px',
                background: theme.accent,
                border: 'none', borderRadius: 12,
                color: dark ? '#000000' : '#ffffff',
                fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s',
                fontFamily: 'DM Sans, sans-serif'
              }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 12, margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }} />
            <span style={{ fontSize: 12, color: theme.textPrimary, opacity: 0.4 }}>or</span>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }} />
          </div>

          <p style={{
            textAlign: 'center', fontSize: 14,
            color: theme.textPrimary, opacity: 0.6
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: theme.accent,
              textDecoration: 'none', fontWeight: 500
            }}>
              Create one
            </Link>
          </p>
        </div>

        <p style={{
          textAlign: 'center', marginTop: 20,
          fontSize: 12, color: theme.textPrimary, opacity: 0.3
        }}>
          Your data is private and secure 🔒
        </p>
      </div>
    </div>
  );
}