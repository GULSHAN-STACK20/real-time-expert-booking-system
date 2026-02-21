import mongoose from 'mongoose';

export const connectDatabase = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.info('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed', error.message);
    process.exit(1);
  }
};
