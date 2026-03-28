import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        fontFamily: 'DM Sans, sans-serif',
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '-0.5px',
        gap: 20
      }}>
        Expensio
        <div style={{
          width: 28, height: 28,
          border: '2.5px solid #333',
          borderTop: '2.5px solid #ffffff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}