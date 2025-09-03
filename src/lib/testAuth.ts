// Dynamic authentication system using dataStore
import { dataStore } from './dynamicDataStore';
import { User } from '@/contexts/AuthContext';

export type TestUser = User;

export const testAuthService = {
  async login(email: string, password: string, role: 'user' | 'collector'): Promise<TestUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Login attempt:', { email, role, password: password.length });
    
    // For testing purposes, accept any password with length >= 6
    if (password.length < 6) {
      console.log('Login failed - password too short');
      return null;
    }
    
    // Find user by email and role
    let user = dataStore.getUserByEmail(email);
    console.log('Initial user lookup by email:', user);
    
    // If no exact match found, try demo email patterns
    if (!user && role === 'user') {
      // Check for demo patterns like ngo@trash2trade.com, diy@trash2trade.com
      if (email === 'ngo@trash2trade.com' || email === 'ngo@test.com') {
        user = dataStore.getAllUsers().find(u => u.subtype === 'ngo-business');
      } else if (email === 'diy@trash2trade.com' || email === 'diy@test.com') {
        user = dataStore.getAllUsers().find(u => u.subtype === 'diy-marketplace');
      } else if (email === 'user@trash2trade.com' || email === 'user@test.com') {
        user = dataStore.getAllUsers().find(u => u.subtype === 'trash-generator');
      }
    }
    
    // If no exact match found but it's a collector login, try collector@test.com specifically
    if (!user && role === 'collector') {
      if (email === 'collector@test.com') {
        user = dataStore.getAllUsers().find(u => u.role === 'collector' && u.email === 'collector@test.com');
      }
      // Fallback: find any collector
      if (!user) {
        user = dataStore.getAllUsers().find(u => u.role === 'collector');
      }
      console.log('Looking for collector user, found:', user);
    }
    
    // Validate role matches
    if (user && user.role !== role) {
      console.log('Login failed - role mismatch');
      return null;
    }
    
    console.log('Found user:', user);
    
    if (user) {
      console.log('Login successful');
      return user;
    }
    
    console.log('Login failed');
    return null;
  },

  async signup(
    name: string, 
    email: string, 
    password: string, 
    role: 'user' | 'collector',
    subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace'
  ): Promise<TestUser | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = dataStore.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: TestUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      subtype,
      greenCoins: 0,
      ecoScore: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    dataStore.addUser(newUser);
    return newUser;
  }
};
