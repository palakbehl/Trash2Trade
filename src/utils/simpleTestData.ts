import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const addSimpleTestData = async () => {
  try {
    console.log('Adding simple test data to Firestore...');

    // Add a simple user
    const userDoc = await addDoc(collection(db, 'users'), {
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      subtype: 'trash-generator',
      greenCoins: 100,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ User added with ID:', userDoc.id);

    // Add a simple waste request
    const wasteDoc = await addDoc(collection(db, 'wasteRequests'), {
      userId: userDoc.id,
      wasteType: 'plastic',
      quantity: 5,
      description: 'Test plastic waste',
      address: 'Test Address',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      preferredTime: new Date(),
      status: 'pending',
      estimatedPrice: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Waste request added with ID:', wasteDoc.id);

    // Add a simple collector
    const collectorDoc = await addDoc(collection(db, 'collectors'), {
      userId: 'test-collector-id',
      vehicleType: 'truck',
      vehicleNumber: 'TEST-123',
      licenseNumber: 'DL123456789',
      aadharNumber: '1234-5678-9012',
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'TEST0001',
        bankName: 'Test Bank'
      },
      serviceAreas: ['Test Area'],
      isActive: true,
      rating: 4.5,
      totalPickups: 10,
      totalEarnings: 500,
      completionRate: 90,
      verificationStatus: 'verified',
      documents: {
        license: 'license-url',
        aadhar: 'aadhar-url',
        vehicle: 'vehicle-url'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Collector added with ID:', collectorDoc.id);

    console.log('🎉 All test data added successfully!');
    console.log('🔥 Now check your Firebase Console - you should see 3 collections:');
    console.log('   - users');
    console.log('   - wasteRequests'); 
    console.log('   - collectors');

    return {
      userId: userDoc.id,
      wasteRequestId: wasteDoc.id,
      collectorId: collectorDoc.id
    };

  } catch (error) {
    console.error('❌ Error adding test data:', error);
    throw error;
  }
};
