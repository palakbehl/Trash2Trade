import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user' | 'collector';
export type UserSubType = 'trash-generator' | 'ngo-business' | 'diy-marketplace';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  subType?: UserSubType;
  avatar?: string;
  greenCoins?: number;
  ecoScore?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, subType?: UserSubType) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, subType?: UserSubType) => Promise<boolean>;
  logout: () => void;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users for development
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'user@trash2trade.com',
      role: 'user' as UserRole,
      subType: 'trash-generator' as UserSubType,
      greenCoins: 150,
      ecoScore: 78,
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'collector@trash2trade.com',
      role: 'collector' as UserRole,
      greenCoins: 250,
      ecoScore: 92,
    },
    {
      id: '3',
      name: 'Green Earth NGO',
      email: 'ngo@trash2trade.com',
      role: 'user' as UserRole,
      subType: 'ngo-business' as UserSubType,
      greenCoins: 500,
      ecoScore: 95,
    },
    {
      id: '4',
      name: 'Sarah DIY',
      email: 'diy@trash2trade.com',
      role: 'user' as UserRole,
      subType: 'diy-marketplace' as UserSubType,
      greenCoins: 300,
      ecoScore: 85,
    },
  ];

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('trash2trade_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole, subType?: UserSubType): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - find user by email and role
    let foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    // If user role and subType provided, match both
    if (role === 'user' && subType) {
      foundUser = mockUsers.find(u => u.email === email && u.role === role && u.subType === subType);
    }
    
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('trash2trade_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string, role: UserRole, subType?: UserSubType): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock signup - create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      subType,
      greenCoins: 0,
      ecoScore: 0,
    };
    
    setUser(newUser);
    localStorage.setItem('trash2trade_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trash2trade_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};