// file to setup the mongodb connection

// importing the required modules
import mongoose from "mongoose";
import dotenv from "dotenv";

// setting up the mongodb
dotenv.config();
const mongodbUri = process.env.MONGODB;

export const connect = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("database connected successfully.....🍃");
  } catch (error) {
    console.error("Error while connecting the mongodb", error);
  }
};
