// file to create the route for the openai

// importing the required modules
import express from "express";
import aiController from "../../controller/aiController.js";

// creating the router
const router = express.Router();

// router for running the model for the ai
router.post("/run", aiController.runAi);

// exporting the router
export default router;
