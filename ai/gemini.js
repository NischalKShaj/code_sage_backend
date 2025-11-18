// file to create the model for the gemini api

// importing the required modules
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// setting up the dotenv
dotenv.config();

// setting up ai model
const genAi = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const model = genAi.getGenerativeModel({
  model: "gemini-2.5-flash",
});
