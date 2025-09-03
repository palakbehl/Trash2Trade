import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import WasteRequest from '../models/WasteRequest.js';
import DIYProduct from '../models/DIYProduct.js';
import Transaction from '../models/Transaction.js';
import Collector from '../models/Collector.js';

dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mapiitasrm2020_db_use:<password>@cluster0.jAVemNCjPuF8VjgWhyjmop9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'ecoconnect_trade';

async function connectToDatabase() {
  try {
    const connectionString = MONGODB_URI.replace('<password>', process.env.MONGODB_PASSWORD || '');
    await mongoose.connect(connectionString, { dbName: DATABASE_NAME });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await WasteRequest.deleteMany({});
    await DIYProduct.deleteMany({});
    await Transaction.deleteMany({});
    await Collector.deleteMany({});
    
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        name: 'John Doe',
        email: 'user@trash2trade.com',
        password: hashedPassword,
        role: 'user',
        subtype: 'trash-generator',
        greenCoins: 150,
        ecoScore: 85,
        isVerified: true,
        address: '123 Green Street, Mumbai, Maharashtra',
        coordinates: { lat: 19.0760, lng: 72.8777 }
      },
      {
        name: 'Sarah NGO',
        email: 'ngo@trash2trade.com',
        password: hashedPassword,
        role: 'user',
        subtype: 'ngo-business',
        greenCoins: 500,
        ecoScore: 200,
        isVerified: true,
        address: '456 NGO Avenue, Delhi, Delhi',
        coordinates: { lat: 28.6139, lng: 77.2090 }
      },
      {
        name: 'Mike DIY',
        email: 'diy@trash2trade.com',
        password: hashedPassword,
        role: 'user',
        subtype: 'diy-marketplace',
        greenCoins: 320,
        ecoScore: 140,
        isVerified: true,
        address: '789 Creative Lane, Bangalore, Karnataka',
        coordinates: { lat: 12.9716, lng: 77.5946 }
      },
      {
        name: 'Jane Collector',
        email: 'collector@test.com',
        password: hashedPassword,
        role: 'collector',
        greenCoins: 450,
        isVerified: true,
        address: '321 Collection Road, Chennai, Tamil Nadu',
        coordinates: { lat: 13.0827, lng: 80.2707 }
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        greenCoins: 1000,
        isVerified: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create collector profile for Jane Collector
    const janeCollector = createdUsers.find(u => u.email === 'collector@test.com');
    if (janeCollector) {
      const collectorProfile = new Collector({
        userId: janeCollector._id,
        vehicleType: 'auto',
        vehicleNumber: 'MH12AB1234',
        licenseNumber: 'DL1234567890',
        aadharNumber: '123456789012',
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank'
        },
        serviceAreas: ['Mumbai', 'Navi Mumbai', 'Thane'],
        isActive: true,
        rating: 4.8,
        totalPickups: 25,
        totalEarnings: 5000,
        completionRate: 96,
        verificationStatus: 'verified',
        documents: {
          license: 'license_doc_url',
          aadhar: 'aadhar_doc_url',
          vehicle: 'vehicle_doc_url'
        }
      });
      await collectorProfile.save();
      console.log('👮 Created collector profile');
    }

    // Create sample DIY products
    const diyUser = createdUsers.find(u => u.email === 'diy@trash2trade.com');
    if (diyUser) {
      const diyProducts = [
        {
          sellerId: diyUser._id,
          title: 'Upcycled Wooden Planter',
          description: 'Beautiful planter made from reclaimed wood. Perfect for indoor plants. Each piece is unique with natural wood grain patterns.',
          price: 450,
          category: 'home-decor',
          condition: 'new',
          materials: 'Reclaimed wood, eco-friendly varnish',
          location: 'Mumbai, Maharashtra',
          images: ['🪴'],
          status: 'active',
          views: 45,
          likes: 12
        },
        {
          sellerId: diyUser._id,
          title: 'Recycled Bottle Lamp',
          description: 'Artistic table lamp made from recycled plastic bottles. LED lights included. Great for ambient lighting.',
          price: 320,
          category: 'lighting',
          condition: 'new',
          materials: 'Recycled plastic bottles, LED lights, metal base',
          location: 'Mumbai, Maharashtra',
          images: ['💡'],
          status: 'active',
          views: 32,
          likes: 8
        },
        {
          sellerId: diyUser._id,
          title: 'Cardboard Desk Organizer',
          description: 'Sturdy desk organizer made from cardboard waste. Multiple compartments for office supplies.',
          price: 180,
          category: 'storage',
          condition: 'new',
          materials: 'Cardboard, non-toxic glue, fabric covering',
          location: 'Mumbai, Maharashtra',
          images: ['📦'],
          status: 'sold',
          views: 28,
          likes: 5
        }
      ];

      await DIYProduct.insertMany(diyProducts);
      console.log(`🎨 Created ${diyProducts.length} DIY products`);
    }

    // Create sample waste requests
    const wasteRequests = [
      {
        userId: createdUsers[0]._id, // John Doe
        wasteType: 'plastic',
        quantity: 5,
        description: 'Plastic bottles and containers from household use',
        address: '123 Green Street, Mumbai, Maharashtra',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        preferredTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending',
        estimatedPrice: 60,
        estimatedValue: 60,
        greenCoins: 120
      },
      {
        userId: createdUsers[1]._id, // Sarah NGO
        wasteType: 'paper',
        quantity: 10,
        description: 'Office papers and cardboard boxes',
        address: '456 NGO Avenue, Delhi, Delhi',
        coordinates: { lat: 28.6139, lng: 77.2090 },
        preferredTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        estimatedPrice: 80,
        estimatedValue: 80,
        greenCoins: 160
      },
      {
        userId: createdUsers[0]._id, // John Doe
        wasteType: 'metal',
        quantity: 3,
        description: 'Aluminum cans and metal scraps',
        address: '123 Green Street, Mumbai, Maharashtra',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        preferredTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'completed',
        collectorId: janeCollector?._id,
        estimatedPrice: 90,
        actualPrice: 95,
        estimatedValue: 90,
        greenCoins: 180,
        greenCoinsEarned: 180,
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    await WasteRequest.insertMany(wasteRequests);
    console.log(`♻️ Created ${wasteRequests.length} waste requests`);

    // Create sample transactions
    const transactions = [
      {
        userId: createdUsers[0]._id,
        collectorId: janeCollector?._id,
        type: 'pickup',
        amount: 95,
        greenCoins: 180,
        description: 'Pickup completed: metal (3kg)',
        status: 'completed'
      },
      {
        userId: createdUsers[1]._id,
        type: 'reward',
        amount: 0,
        greenCoins: 100,
        description: 'Welcome bonus for NGO registration',
        status: 'completed'
      }
    ];

    await Transaction.insertMany(transactions);
    console.log(`💰 Created ${transactions.length} transactions`);

    console.log('✅ Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Waste Requests: ${await WasteRequest.countDocuments()}`);
    console.log(`- DIY Products: ${await DIYProduct.countDocuments()}`);
    console.log(`- Transactions: ${await Transaction.countDocuments()}`);
    console.log(`- Collectors: ${await Collector.countDocuments()}`);

    console.log('\n🔑 Test Login Credentials:');
    console.log('User: user@trash2trade.com / password123');
    console.log('NGO: ngo@trash2trade.com / password123');
    console.log('DIY: diy@trash2trade.com / password123');
    console.log('Collector: collector@test.com / password123');
    console.log('Admin: admin@test.com / password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeder
async function main() {
  await connectToDatabase();
  await seedData();
}

main().catch(console.error);
