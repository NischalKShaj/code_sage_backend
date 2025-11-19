// file to setup the mongodb connection

// importing the required modules
import mongoose from "mongoose";
import dotenv from "dotenv";

// setting up the mongodb
dotenv.config();
const mongodbUri = process.env.MONGODB;

const mongoAtlas = process.env.MONGO_ATLAS;

export const connect = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("database connected successfully.....🍃");
  } catch (error) {
    console.error("Error while connecting the mongodb", error);
    console.log("⏳ Trying MongoDB ATLAS...");

    try {
      await mongoose.connect(mongoAtlas);
      console.log("✅ Connected to MongoDB Atlas");
    } catch (atlasErr) {
      console.error("❌ MongoDB Atlas connection failed:", atlasErr.message);
      process.exit(1);
    }
  }
};
