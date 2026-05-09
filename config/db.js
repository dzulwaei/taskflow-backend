/**
 * Database connection utility.
 * Connects to MongoDB using the configured URI.
 */
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the configured URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;