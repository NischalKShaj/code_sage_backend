// file to create the model for the ai trash part

// importing the required modules
import { Schema, model } from "mongoose";

// creating the schema for the history
const trashSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    history: {
      type: Schema.Types.ObjectId,
      ref: "ChatHistory",
      required: true,
    },
  },
  { timestamps: true }
);

// creating the index for the user
trashSchema.index({ user: 1, createdAt: -1 });

// creating the model and exporting it
export const trashModel = model("Trash", trashSchema);
