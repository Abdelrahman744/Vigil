import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  // 1. Ensure DNS is reliable
  dns.setServers(['8.8.8.8', '1.1.1.1']);

  // 2. Check for URI (Defensive Check)
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in environment (set it in .env)");
    process.exit(1);
  }

  // 3. Connect
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    process.exit(1);
  }
};

export default connectDB;