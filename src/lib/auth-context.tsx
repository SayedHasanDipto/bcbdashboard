'use client';
// src/lib/auth-context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Teacher } from '@/types';

interface AuthCtx {
  user: Teacher | null;
  login: (teacher: Teacher) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Teacher | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('bcb_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = (teacher: Teacher) => {
    setUser(teacher);
    sessionStorage.setItem('bcb_user', JSON.stringify(teacher));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('bcb_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
