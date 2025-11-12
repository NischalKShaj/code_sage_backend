// file to create the schema for the user

// importing the required modules
import { Schema, model } from "mongoose";

// setting up the schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// creating the model and exporting it
export const user = model("User", userSchema);
