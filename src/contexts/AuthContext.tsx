import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dataStore } from '@/lib/dynamicDataStore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace';
  greenCoins: number;
  ecoScore?: number;
  isVerified: boolean;
  location?: string;
  phone?: string;
  createdAt: Date | { toDate: () => Date };
  updatedAt: Date | { toDate: () => Date };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'collector') => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: 'user' | 'collector' | 'admin', subtype?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const checkExistingUser = () => {
      setIsLoading(true);
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
        }
      }
      setIsLoading(false);
    };

    checkExistingUser();
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'collector'): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find user in dynamic data store by email and role
      const users = dataStore.getAllUsers();
      const foundUser = users.find(u => u.email === email && (u.role === role || role === 'user'));
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'collector' | 'admin', subtype?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Starting signup process...', { name, email, role, subtype });
      
      // Create new user in dynamic data store
      const newUserId = `usr_${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        name,
        email,
        role: role as 'user' | 'collector' | 'admin',
        subtype: subtype as 'trash-generator' | 'ngo-business' | 'diy-marketplace' | undefined,
        greenCoins: 0,
        ecoScore: 0,
        isVerified: false,
        location: '',
        phone: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dataStore.addUser(newUser);
      
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        console.log('User created successfully');
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};