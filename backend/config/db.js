import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from the .env file
dotenv.config();


const connectDB = async () => {

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(process.env.MONGO_URI)
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
