import mongoose from 'mongoose';

// MongoDB connection configuration
const MONGODB_URI = 'mongodb+srv://mapiitasrm2020_db_use:<password>@cluster0.jAVemNCjPuF8VjgWhyjmop9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DATABASE_NAME = 'ecoconnect_trade';

// Replace <password> with your actual MongoDB password
// You can also set this in environment variables for better security

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

export async function connectToDatabase() {
  if (connection.isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI.replace('<password>', process.env.MONGODB_PASSWORD || ''), {
      dbName: DATABASE_NAME,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function disconnectFromDatabase() {
  if (!connection.isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    connection.isConnected = 0;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}

// Get database connection
export function getDatabase() {
  return mongoose.connection.db;
}

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

export default mongoose;

