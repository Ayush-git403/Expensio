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
    <>
      <div style={{
        background: theme.navBg,
        borderBottom: `1px solid ${theme.navBorder}`,
        padding: isMobile ? '0 16px' : '0 40px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 60, position: 'sticky', top: 0, zIndex: 100,
        transition: 'background 0.3s'
      }}>
        {/* Logo — always white on black navbar */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: isMobile ? 20 : 24,
            color: '#ffffff',
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            Expensio
          </span>
          {!isMobile && (
            <span style={{
              fontSize: 11, color: '#888888',
              fontWeight: 300, letterSpacing: '0.05em'
            }}>
              expense tracker
            </span>
          )}
        </div>

        {/* Desktop right */}
        {!isMobile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* Theme toggle */}
            <button onClick={toggle} style={{
              width: 52, height: 28, borderRadius: 99,
              background: dark ? '#222' : '#333',
              border: '1px solid #444',
              cursor: 'pointer', position: 'relative',
              transition: 'background 0.3s'
            }}>
              <div style={{
                position: 'absolute', top: 4,
                left: dark ? 28 : 4,
                width: 20, height: 20, borderRadius: '50%',
                background: dark ? '#ffffff' : '#ffffff',
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
                  background: '#1a1a1a',
                  padding: '6px 14px', borderRadius: 99,
                  border: '1px solid #333'
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: '#000000'
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: 13, color: '#ffffff',
                    fontWeight: 400
                  }}>
                    {user.name}
                  </span>
                </div>

                <button onClick={handleLogout} style={{
                  padding: '8px 18px', borderRadius: 8,
                  border: '1px solid #ff4444',
                  background: 'transparent',
                  color: '#ff4444',
                  fontSize: 13, cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  fontFamily: 'DM Sans, sans-serif'
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#ff4444';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ff4444';
                  }}>
                  Logout
                </button>
              </>
            )}
          </div>
        ) : (
          /* Mobile right */
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={toggle} style={{
              width: 44, height: 24, borderRadius: 99,
              background: '#222', border: '1px solid #444',
              cursor: 'pointer', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: dark ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%',
                background: '#ffffff',
                transition: 'left 0.3s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10
              }}>
                {dark ? '🌙' : '☀️'}
              </div>
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none',
              border: '1px solid #444',
              borderRadius: 8, padding: '6px 10px',
              cursor: 'pointer', color: '#ffffff', fontSize: 16
            }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          background: '#000000',
          borderBottom: '1px solid #222',
          padding: '16px',
          zIndex: 99,
          display: 'flex', flexDirection: 'column', gap: 12
        }}>
          {user && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid #222'
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: '#000000'
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#666' }}>Signed in</div>
                </div>
              </div>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  padding: '12px',
                  borderRadius: 10,
                  border: '1px solid #ff4444',
                  background: 'transparent',
                  color: '#ff4444',
                  fontSize: 14, cursor: 'pointer',
                  fontWeight: 500,
                  fontFamily: 'DM Sans, sans-serif'
                }}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}