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
      // Just set user to null — don't redirect
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
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
        fontFamily: 'DM Sans, sans-serif',
        color: '#ffffff',
        fontSize: 18,
        letterSpacing: '-0.3px',
        fontWeight: 600
      }}>
        Expensio
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