import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import WasteRequest from '../models/WasteRequest.js';
import DIYProduct from '../models/DIYProduct.js';

dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mapiitasrm2020_db_use:<password>@cluster0.jAVemNCjPuF8VjgWhyjmop9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'ecoconnect_trade';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Connect to MongoDB
    const connectionString = MONGODB_URI.replace('<password>', process.env.MONGODB_PASSWORD || '');
    await mongoose.connect(connectionString, { dbName: DATABASE_NAME });
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📍 Database: ${DATABASE_NAME}`);
    console.log(`🌐 Connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // Test database operations
    console.log('\n🧪 Testing database operations...');

    // Count documents
    const userCount = await User.countDocuments();
    const wasteRequestCount = await WasteRequest.countDocuments();
    const productCount = await DIYProduct.countDocuments();

    console.log(`👥 Users: ${userCount}`);
    console.log(`♻️ Waste Requests: ${wasteRequestCount}`);
    console.log(`🎨 DIY Products: ${productCount}`);

    // Test a simple query
    if (userCount > 0) {
      const sampleUser = await User.findOne().select('name email role');
      console.log(`📋 Sample user: ${sampleUser.name} (${sampleUser.email}) - ${sampleUser.role}`);
    }

    // Test indexes
    console.log('\n📊 Testing indexes...');
    const userIndexes = await User.collection.getIndexes();
    const wasteIndexes = await WasteRequest.collection.getIndexes();
    
    console.log(`🔍 User indexes: ${Object.keys(userIndexes).length}`);
    console.log(`🔍 Waste request indexes: ${Object.keys(wasteIndexes).length}`);

    // Test aggregation
    if (wasteRequestCount > 0) {
      console.log('\n📈 Testing aggregation...');
      const wasteStats = await WasteRequest.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalQuantity: { $sum: '$quantity' }
          }
        }
      ]);
      
      console.log('📊 Waste request statistics:');
      wasteStats.forEach(stat => {
        console.log(`   ${stat._id}: ${stat.count} requests, ${stat.totalQuantity}kg total`);
      });
    }

    console.log('\n✅ All database tests passed!');
    console.log('\n🚀 Ready to start the application!');
    console.log('Run: npm start (to start frontend + backend)');
    console.log('Or:  npm run backend (backend only)');

  } catch (error) {
    console.error('❌ Database connection test failed:');
    console.error(error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Solution: Check your MongoDB password in the environment variables');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Solution: Check your network connection and MongoDB cluster status');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Solution: Check your MongoDB connection string');
    } else {
      console.error('\n💡 Solution: Verify your MongoDB configuration and try again');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Health check for API
async function testApiHealth() {
  try {
    console.log('\n🌐 Testing API health...');
    
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Health Check:', data);
    } else {
      console.log('⚠️ API not running on port 3001');
      console.log('💡 Start the backend: npm run backend');
    }
  } catch (error) {
    console.log('⚠️ API not accessible:', error.message);
    console.log('💡 Start the backend: npm run backend');
  }
}

// Main test function
async function runTests() {
  console.log('🔧 EcoConnect Trade - Database Connection Test\n');
  
  await testConnection();
  await testApiHealth();
  
  console.log('\n📋 Next Steps:');
  console.log('1. If no data exists, run: npm run seed');
  console.log('2. Start the application: npm start');
  console.log('3. Open http://localhost:5173 in your browser');
  console.log('4. Test with credentials from SETUP.md');
}

runTests().catch(console.error);
