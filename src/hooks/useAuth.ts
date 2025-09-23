import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('access_token'));
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) as User : null;
  });

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(!!localStorage.getItem('access_token'));
      const u = localStorage.getItem('user');
      setUser(u ? (JSON.parse(u) as User) : null);
    };
    window.addEventListener('authChange', handler);
    return () => window.removeEventListener('authChange', handler);
  }, []);

  const updateAuthStatus = useCallback(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
    const u = localStorage.getItem('user');
    setUser(u ? (JSON.parse(u) as User) : null);
  }, []);

  return { isAuthenticated, user, updateAuthStatus };
};
