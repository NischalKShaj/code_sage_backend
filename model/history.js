// file to create the model for the ai history part

// importing the required modules
import { Schema, model } from "mongoose";

// creating the schema for the history
const historySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    output: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// creating the index for the user
historySchema.index({ user: 1, createdAt: -1 });

// creating the model and exporting it
export const historyModel = model("ChatHistory", historySchema);
