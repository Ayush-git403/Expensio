import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../hooks/useWindowSize';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle, theme } = useTheme();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{
      background: theme.cardBg,
      borderBottom: `1px solid ${theme.cardBorder}`,
      padding: isMobile ? '0 16px' : '0 28px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      height: 60, position: 'sticky', top: 0, zIndex: 100,
      transition: 'background 0.3s'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="serif" style={{ fontSize: isMobile ? 22 : 26, color: theme.accent }}>
          Expensio
        </span>
        {!isMobile && (
          <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 300 }}>
            expense tracker
          </span>
        )}
      </div>

      {/* Desktop right side */}
      {!isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Theme toggle */}
          <button onClick={toggle} style={{
            width: 52, height: 28, borderRadius: 99,
            background: dark ? '#2a2a2a' : theme.almond,
            border: `1px solid ${dark ? '#444' : theme.cardBorder}`,
            cursor: 'pointer', position: 'relative', transition: 'background 0.3s'
          }}>
            <div style={{
              position: 'absolute', top: 4,
              left: dark ? 28 : 4,
              width: 20, height: 20, borderRadius: '50%',
              background: dark ? '#ffffff' : theme.magenta,
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
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11, fontWeight: 600,
                  color: dark ? '#000000' : '#ffffff'
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, color: theme.textMuted }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} style={{
                padding: '7px 16px', borderRadius: 8,
                border: `1px solid ${theme.highlight}`,
                background: 'transparent', color: theme.highlight,
                fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseOver={e => { e.target.style.background = theme.highlight; e.target.style.color = '#fff'; }}
                onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = theme.highlight; }}>
                Logout
              </button>
            </>
          )}
        </div>
      ) : (
        /* Mobile right side */
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggle} style={{
            width: 44, height: 24, borderRadius: 99,
            background: dark ? '#2a2a2a' : theme.almond,
            border: `1px solid ${dark ? '#444' : theme.cardBorder}`,
            cursor: 'pointer', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: dark ? 23 : 3,
              width: 18, height: 18, borderRadius: '50%',
              background: dark ? '#ffffff' : theme.magenta,
              transition: 'left 0.3s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 10
            }}>
              {dark ? '🌙' : '☀️'}
            </div>
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: `1px solid ${theme.cardBorder}`,
            borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
            color: theme.textPrimary, fontSize: 16
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute', top: 60, left: 0, right: 0,
          background: theme.cardBg,
          borderBottom: `1px solid ${theme.cardBorder}`,
          padding: '16px', zIndex: 99,
          display: 'flex', flexDirection: 'column', gap: 12
        }}>
          {user && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderBottom: `1px solid ${theme.cardBorder}`
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: theme.accent,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 16,
                  fontWeight: 600, color: dark ? '#000' : '#fff'
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: theme.textPrimary }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>
                    Signed in
                  </div>
                </div>
              </div>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  padding: '12px', borderRadius: 10,
                  border: `1px solid ${theme.highlight}`,
                  background: 'transparent', color: theme.highlight,
                  fontSize: 14, cursor: 'pointer', fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}