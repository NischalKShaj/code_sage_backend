// file to create the route for the dashboard

// importing the required modules
import express from "express";
import dashboardController from "../../controller/dashboardController.js";

// creating the router
const router = express.Router();

// router for getting the history for the specific user
router.get("/history/:id", dashboardController.getChatHistory);

// router for deleting the history for the specific user
router.delete("/history/:id/:userId", dashboardController.deleteChatHistory);

// exporting the router
export default router;
