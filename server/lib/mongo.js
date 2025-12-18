import mongoose from 'mongoose';

export async function connectMongo() {
  if (mongoose.connection.readyState >= 1) {
    console.log('✅ MongoDB already connected');
    return;
  }
  
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in .env file');
  
  try {
    await mongoose.connect(uri, { 
      dbName: process.env.MONGODB_DB || 'ck',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully to database:', process.env.MONGODB_DB || 'ck');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}
