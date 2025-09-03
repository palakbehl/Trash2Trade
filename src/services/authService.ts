import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/database';

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'collector';
  subtype?: 'trash-generator' | 'ngo-business' | 'diy-marketplace';
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
  role: 'user' | 'collector';
  subtype?: string;
}

export const authService = {
  // Sign up new user
  async signup(data: SignupData): Promise<User> {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Update Firebase auth profile
      await updateProfile(firebaseUser, {
        displayName: data.name
      });

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        subtype: data.subtype,
        address: data.address,
        greenCoins: 0,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  // Sign in existing user
  async login(data: LoginData): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data() as User;
      
      // Verify role matches
      if (userData.role !== data.role) {
        await signOut(auth);
        throw new Error('Invalid role for this account');
      }

      // Update last login
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        updatedAt: serverTimestamp()
      });

      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Sign out user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }
};
