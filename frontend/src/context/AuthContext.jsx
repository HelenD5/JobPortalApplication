import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || null);
  const [loading, setLoading] = useState(false);

  const loginUser = (authData) => {
    const userData = {
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      companyId: authData.companyId,
      companyName: authData.companyName,
    };
    setToken(authData.token);
    setUser(userData);
    localStorage.setItem('jwtToken', authData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loginUser,
        logoutUser,
        updateUserProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
