import { mongoService } from './mongoService';
import type { IUser } from '@/models';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'collector' | 'admin';
  subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace';
  greenCoins: number;
  ecoScore?: number;
  isVerified: boolean;
  createdAt: Date | { toDate: () => Date };
  updatedAt: Date | { toDate: () => Date };
}

export class MongoAuthService {
  private static instance: MongoAuthService;

  private constructor() {}

  public static getInstance(): MongoAuthService {
    if (!MongoAuthService.instance) {
      MongoAuthService.instance = new MongoAuthService();
    }
    return MongoAuthService.instance;
  }

  async login(email: string, password: string, role: 'user' | 'collector'): Promise<AuthUser | null> {
    try {
      // Find user by email
      const user = await mongoService.getUserByEmail(email);
      
      if (!user) {
        console.log('User not found');
        return null;
      }

      // For demo purposes, we'll skip password verification
      // In production, you should verify the password hash
      
      // Check if user role matches
      if (user.role !== role && user.role !== 'admin') {
        console.log('Role mismatch');
        return null;
      }

      return this.convertToAuthUser(user);
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async signup(
    name: string, 
    email: string, 
    password: string, 
    role: 'user' | 'collector', 
    subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace'
  ): Promise<AuthUser | null> {
    try {
      // Check if user already exists
      const existingUser = await mongoService.getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists');
        return null;
      }

      // Create new user
      const userData: Partial<IUser> = {
        name,
        email: email.toLowerCase(),
        role,
        subtype,
        greenCoins: 0,
        ecoScore: 0,
        isVerified: true // For demo purposes
      };

      const newUser = await mongoService.createUser(userData);
      return this.convertToAuthUser(newUser);
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    try {
      const user = await mongoService.getUserById(id);
      return user ? this.convertToAuthUser(user) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<AuthUser | null> {
    try {
      const user = await mongoService.updateUser(id, updates);
      return user ? this.convertToAuthUser(user) : null;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  }

  private convertToAuthUser(user: IUser): AuthUser {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      subtype: user.subtype,
      greenCoins: user.greenCoins,
      ecoScore: user.ecoScore,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  // Test methods for development
  async createTestUsers(): Promise<void> {
    try {
      const testUsers = [
        {
          name: 'John Doe',
          email: 'user@trash2trade.com',
          role: 'user' as const,
          subtype: 'trash-generator' as const,
          greenCoins: 150,
          ecoScore: 85,
          isVerified: true
        },
        {
          name: 'Sarah NGO',
          email: 'ngo@trash2trade.com',
          role: 'user' as const,
          subtype: 'ngo-business' as const,
          greenCoins: 500,
          ecoScore: 200,
          isVerified: true
        },
        {
          name: 'Mike DIY',
          email: 'diy@trash2trade.com',
          role: 'user' as const,
          subtype: 'diy-marketplace' as const,
          greenCoins: 320,
          ecoScore: 140,
          isVerified: true
        },
        {
          name: 'Jane Collector',
          email: 'collector@test.com',
          role: 'collector' as const,
          greenCoins: 450,
          isVerified: true
        },
        {
          name: 'Admin User',
          email: 'admin@test.com',
          role: 'admin' as const,
          greenCoins: 1000,
          isVerified: true
        }
      ];

      for (const userData of testUsers) {
        const existingUser = await mongoService.getUserByEmail(userData.email);
        if (!existingUser) {
          await mongoService.createUser(userData);
          console.log(`Created test user: ${userData.email}`);
        }
      }
    } catch (error) {
      console.error('Error creating test users:', error);
    }
  }
}

export const mongoAuthService = MongoAuthService.getInstance();

