import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { email: string; initials: string } | null;
  login: (email: string, accessCode: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'flex-manager-session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as { isAuthenticated: boolean; user: { email: string; initials: string } | null };
      } catch {
        return { isAuthenticated: false, user: null };
      }
    }
    return { isAuthenticated: false, user: null };
  });

  const login = useCallback(async (email: string, accessCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (accessCode.trim() !== 'flex-manager') {
      throw new Error('Invalid access code. Try "flex-manager".');
    }
    const initials = email
      .split('@')[0]
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    const user = { email, initials };
    const nextState = { isAuthenticated: true, user };
    setState(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }, []);

  const logout = useCallback(() => {
    setState({ isAuthenticated: false, user: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      login,
      logout,
    }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

