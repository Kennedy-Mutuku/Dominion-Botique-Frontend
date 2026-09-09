import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    if (username.trim() === 'User' && password === 'Lucy') {
      const u = { id: '1', name: 'User', role: 'user' };
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      return { success: true };
    }
    if (username.trim() === 'Admin' && password === 'Rev') {
      const u = { id: '2', name: 'Admin', role: 'admin' };
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
