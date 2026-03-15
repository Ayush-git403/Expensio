import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.3s'
    }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '0 20px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="serif" style={{ fontSize: 42, color: theme.accent }}>Expensio</span>
          <p style={{ color: theme.textMuted, fontSize: 14, marginTop: 8 }}>
            Create your free account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: 20, padding: '36px 32px',
          transition: 'background 0.3s'
        }}>

          {/* Error */}
          {error && (
            <div style={{
              background: theme.highlight + '22',
              border: `1px solid ${theme.highlight}`,
              borderRadius: 10, padding: '10px 14px',
              color: theme.highlight, fontSize: 13, marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'FULL NAME',  key: 'name',     type: 'text',     placeholder: 'John Doe' },
              { label: 'EMAIL',      key: 'email',     type: 'email',    placeholder: 'you@example.com' },
              { label: 'PASSWORD',   key: 'password',  type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block', fontSize: 11,
                  color: theme.textMuted, marginBottom: 7,
                  letterSpacing: '0.06em', fontWeight: 500
                }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{
                    width: '100%',
                    background: theme.inputBg,
                    borderColor: theme.cardBorder,
                    color: theme.textPrimary
                  }}
                  required
                />
              </div>
            ))}

            <div style={{ marginTop: 28 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: theme.accent,
                  border: 'none', borderRadius: 12,
                  color: '#ffffff', fontSize: 15,
                  fontWeight: 600, cursor: 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.2s, transform 0.1s'
                }}
                onMouseOver={e => e.target.style.opacity = 0.88}
                onMouseOut={e => e.target.style.opacity = loading ? 0.7 : 1}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }} />
            <span style={{ fontSize: 12, color: theme.textSubtle }}>or</span>
            <div style={{ flex: 1, height: 1, background: theme.cardBorder }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: theme.textMuted }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: theme.accent,
              textDecoration: 'none', fontWeight: 500
            }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', marginTop: 24,
          fontSize: 12, color: theme.textSubtle
        }}>
          Your data is private and secure 🔒
        </p>
      </div>
    </div>
  );
}