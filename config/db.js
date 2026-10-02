import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Connect to MongoDB using the in-memory server.
 * Zero installation needed.
 */
export default async function connectDB() {
  try {
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } else {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected (In-Memory): ${conn.connection.host}`);
    }
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    // In serverless environments, we shouldn't exit the process
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
}
