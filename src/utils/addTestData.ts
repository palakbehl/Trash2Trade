import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, WasteRequest, Collector } from '@/types/database';

export const addTestData = async () => {
  try {
    console.log('Adding test data to Firestore...');

    // Add test user
    const testUser: Omit<User, 'id'> = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      subtype: 'trash-generator',
      phone: '+1234567890',
      address: '123 Green Street, Eco City',
      greenCoins: 150,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userRef = await addDoc(collection(db, 'users'), testUser);
    console.log('Test user added with ID:', userRef.id);

    // Add test waste request
    const testWasteRequest: Omit<WasteRequest, 'id'> = {
      userId: userRef.id,
      wasteType: 'plastic',
      quantity: 5.2,
      description: 'Plastic bottles and containers',
      address: '123 Green Street, Eco City',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      preferredTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      estimatedPrice: 15.60,
      status: 'pending',
      images: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const wasteRef = await addDoc(collection(db, 'wasteRequests'), testWasteRequest);
    console.log('Test waste request added with ID:', wasteRef.id);

    // Add test collector
    const testCollector: Omit<Collector, 'id'> = {
      userId: 'collector-user-id',
      vehicleType: 'truck',
      vehicleNumber: 'ECO-123',
      serviceAreas: ['Downtown', 'Green District'],
      isActive: true,
      rating: 4.8,
      totalPickups: 150,
      totalEarnings: 2500.75,
      completionRate: 95.5,
      verificationStatus: 'verified' as const,
      documents: {
        license: 'license-doc-url',
        aadhar: 'aadhar-doc-url',
        vehicle: 'vehicle-doc-url'
      },
      licenseNumber: 'DL123456789',
      aadharNumber: '1234-5678-9012',
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'BANK0001234',
        bankName: 'Eco Bank'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const collectorRef = await addDoc(collection(db, 'collectors'), testCollector);
    console.log('Test collector added with ID:', collectorRef.id);

    console.log('✅ Test data added successfully!');
    console.log('🔥 Check your Firebase Console to see the data');
    
    return {
      userId: userRef.id,
      wasteRequestId: wasteRef.id,
      collectorId: collectorRef.id
    };

  } catch (error) {
    console.error('❌ Error adding test data:', error);
    throw error;
  }
};

// Function to clear test data
export const clearTestData = async () => {
  console.log('⚠️  Note: Use Firebase Console to delete collections manually');
  console.log('Or implement batch delete operations as needed');
};
