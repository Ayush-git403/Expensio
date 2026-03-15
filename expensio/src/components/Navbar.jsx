import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle, theme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{
      background: theme.cardBg,
      borderBottom: `1px solid ${theme.cardBorder}`,
      padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
      transition: 'background 0.3s'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="serif" style={{ fontSize: 26, color: theme.accent }}>Expensio</span>
        <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 300 }}>expense tracker</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Theme Toggle */}
        <button onClick={toggle}
          style={{
            width: 52, height: 28, borderRadius: 99,
            background: dark ? theme.cardBorder : theme.almond,
            border: 'none', cursor: 'pointer',
            position: 'relative', transition: 'background 0.3s'
          }}>
          <div style={{
            position: 'absolute', top: 4,
            left: dark ? 28 : 4,
            width: 20, height: 20, borderRadius: '50%',
            background: dark ? theme.accent : theme.magenta,
            transition: 'left 0.3s',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11
          }}>
            {dark ? '🌙' : '☀️'}
          </div>
        </button>

        {user && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: theme.bg, padding: '6px 12px',
              borderRadius: 99, border: `1px solid ${theme.cardBorder}`
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: theme.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, color: '#fff'
              }}>
                {user.name[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: theme.textMuted }}>{user.name}</span>
            </div>
            <button onClick={handleLogout}
              style={{
                padding: '7px 16px', borderRadius: 8,
                border: `1px solid ${theme.highlight}`,
                background: 'transparent',
                color: theme.highlight,
                fontSize: 13, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.target.style.background = theme.highlight; e.target.style.color = '#fff'; }}
              onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = theme.highlight; }}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}