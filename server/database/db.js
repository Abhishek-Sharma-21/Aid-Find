import mongoose from "mongoose";

let isConnected = false;

export const connectDb = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is perfectly undefined/missing.");
    }

    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error:", error);
    // Don't process.exit(1) here as Vercel serverless functions shouldn't exit the process
    throw error;
  }
};
