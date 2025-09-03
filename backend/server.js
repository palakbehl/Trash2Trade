import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import wasteRoutes from './routes/waste.js';
import productRoutes from './routes/products.js';
import collectorRoutes from './routes/collectors.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mapiitasrm2020_db_use:<password>@cluster0.jAVemNCjPuF8VjgWhyjmop9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = process.env.DATABASE_NAME || 'ecoconnect_trade';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    // Replace <password> with your actual MongoDB password
    const connectionString = MONGODB_URI.replace('<password>', process.env.MONGODB_PASSWORD || '');
    
    await mongoose.connect(connectionString, {
      dbName: DATABASE_NAME,
    });
    
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 EcoConnect Trade Backend running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   POST /api/auth/login - User login`);
    console.log(`   POST /api/auth/signup - User signup`);
    console.log(`   GET  /api/users - Get all users`);
    console.log(`   GET  /api/waste/requests - Get waste requests`);
    console.log(`   POST /api/waste/requests - Create waste request`);
    console.log(`   GET  /api/products - Get DIY products`);
    console.log(`   POST /api/products - Create DIY product`);
    console.log(`   GET  /api/collectors - Get collectors`);
    console.log(`   GET  /api/analytics - Get analytics data`);
    console.log(`\n💾 Database: ${DATABASE_NAME}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
}

startServer().catch(console.error);

export default app;
