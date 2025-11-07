import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from the .env file
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://abdulwassay2959_db_user:wasay123%40@cluster0.l9knfnl.mongodb.net/?appName=Cluster0');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(process.env.MONGO_URI)
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
