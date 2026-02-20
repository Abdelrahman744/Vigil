import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {

  dns.setServers(['8.8.8.8', '1.1.1.1']);

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in environment (set it in .env)");
    process.exit(1);
  }
  
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;