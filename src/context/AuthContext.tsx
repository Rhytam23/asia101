import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Farmer' | 'Cooperative' | 'Government' | 'Research';

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  avatarUrl?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'vi';
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Omit<User, 'id' | 'preferences'>) => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<User['preferences']>) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('mekong_auth_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('mekong_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: Omit<User, 'id' | 'preferences'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substring(7),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
      }
    };
    setUser(newUser);
    localStorage.setItem('mekong_auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mekong_auth_user');
  };

  const updatePreferences = (prefs: Partial<User['preferences']>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...prefs }
    };
    setUser(updatedUser);
    localStorage.setItem('mekong_auth_user', JSON.stringify(updatedUser));
  };

  const hasRole = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  if (isLoading) {
    return null; // or a full-screen loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updatePreferences, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
