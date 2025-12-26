import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  guestLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('nexus_session_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user session", error);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const loginAttempts = useRef<{ count: number; windowStart: number }>({ count: 0, windowStart: Date.now() });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_session_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_session_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const now = Date.now();
    if (now - loginAttempts.current.windowStart > 10 * 60 * 1000) {
      loginAttempts.current = { count: 0, windowStart: now };
    }
    
    if (loginAttempts.current.count >= 10) {
      alert("Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.");
      setIsLoading(false);
      return false;
    }
    loginAttempts.current.count++;

    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    // Logic mật khẩu đặc biệt cho Admin
    if (foundUser) {
        if (foundUser.role === 'admin') {
            if (pass === '123456789') {
                setUser(foundUser);
                setIsLoading(false);
                return true;
            }
        } else {
            // User thường (demo pass là 'password')
            if (pass === 'password') {
                setUser(foundUser);
                setIsLoading(false);
                return true;
            }
        }
    }

    setIsLoading(false);
    return false;
  };

  const guestLogin = () => {
    const guestUser: User = {
        id: 'guest',
        name: 'Guest User',
        email: '',
        avatar: 'https://picsum.photos/seed/guest/200/200',
        role: 'guest',
        isOnline: true,
        friendIds: [],
        blockedIds: []
    };
    setUser(guestUser);
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_session_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, guestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};