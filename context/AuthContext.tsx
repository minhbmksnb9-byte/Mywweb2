import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { User, UserRole } from '../types';
import { MOCK_ADMIN, MOCK_USER, MOCK_USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  guestLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Security simulation: Rate limiting login attempts
  const loginAttempts = useRef<{ count: number; windowStart: number }>({ count: 0, windowStart: Date.now() });

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Rate Limit Check (10 attempts per 10 mins)
    const now = Date.now();
    if (now - loginAttempts.current.windowStart > 10 * 60 * 1000) {
      loginAttempts.current = { count: 0, windowStart: now };
    }
    
    if (loginAttempts.current.count >= 10) {
      alert("Too many login attempts. Please try again later.");
      setIsLoading(false);
      return false;
    }
    loginAttempts.current.count++;

    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    // Simple password check simulation (In real app, use bcrypt on server)
    // For demo: password is 'password' for everyone
    if (foundUser && pass === 'password') {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const guestLogin = () => {
    setUser({
        id: 'guest',
        name: 'Guest User',
        email: '',
        avatar: 'https://picsum.photos/seed/guest/200/200',
        role: 'guest',
        isOnline: true
    });
  }

  const logout = () => {
    setUser(null);
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