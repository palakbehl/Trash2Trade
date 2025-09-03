import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collector } from '@/types/database';

export interface CollectorRegistrationData {
  userId: string;
  vehicleType: 'bike' | 'auto' | 'truck' | 'van';
  vehicleNumber: string;
  licenseNumber: string;
  aadharNumber: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  serviceAreas: string[];
  documents: {
    license: string;
    aadhar: string;
    vehicle: string;
  };
}

export const collectorService = {
  // Register new collector
  async registerCollector(data: CollectorRegistrationData): Promise<string> {
    try {
      const collectorData = {
        ...data,
        isActive: false,
        rating: 0,
        totalPickups: 0,
        totalEarnings: 0,
        completionRate: 0,
        verificationStatus: 'pending' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'collectors'), collectorData);
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to register collector');
    }
  },

  // Get collector by user ID
  async getCollectorByUserId(userId: string): Promise<Collector | null> {
    try {
      const q = query(
        collection(db, 'collectors'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Collector;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch collector data');
    }
  },

  // Update collector verification status
  async updateVerificationStatus(
    collectorId: string, 
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'collectors', collectorId), {
        verificationStatus: status,
        isActive: status === 'verified',
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update verification status');
    }
  },

  // Update collector stats after pickup completion
  async updateCollectorStats(
    collectorId: string, 
    earnings: number, 
    rating?: number
  ): Promise<void> {
    try {
      const collectorRef = doc(db, 'collectors', collectorId);
      const collectorDoc = await getDoc(collectorRef);
      
      if (!collectorDoc.exists()) {
        throw new Error('Collector not found');
      }

      const currentData = collectorDoc.data() as Collector;
      const newTotalPickups = currentData.totalPickups + 1;
      const newTotalEarnings = currentData.totalEarnings + earnings;
      
      let newRating = currentData.rating;
      if (rating) {
        newRating = ((currentData.rating * currentData.totalPickups) + rating) / newTotalPickups;
      }

      await updateDoc(collectorRef, {
        totalPickups: newTotalPickups,
        totalEarnings: newTotalEarnings,
        rating: newRating,
        completionRate: Math.min(100, (newTotalPickups / (newTotalPickups + 1)) * 100),
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update collector stats');
    }
  },

  // Get all collectors for admin
  async getAllCollectors(): Promise<Collector[]> {
    try {
      const q = query(
        collection(db, 'collectors'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Collector[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch collectors');
    }
  },

  // Toggle collector active status
  async toggleActiveStatus(collectorId: string, isActive: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, 'collectors', collectorId), {
        isActive,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update active status');
    }
  }
};
