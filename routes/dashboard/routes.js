// file to create the route for the dashboard

// importing the required modules
import express from "express";
import dashboardController from "../../controller/dashboardController.js";

// creating the router
const router = express.Router();

// router for permanently removing the history
router.delete("/trash/:id", dashboardController.deletePermanent);

// router for editing the user profile
router.post("/edit-profile/:id", dashboardController.editUser);

// router for getting the history for the specific user
router.get("/history/:id", dashboardController.getChatHistory);

// router for deleting the history for the specific user
router.delete("/history/:id/:userId", dashboardController.deleteChatHistory);

// router for restoring the trash
router.put("/restore/:id", dashboardController.restoreTrash);

// router for getting the trash data
router.get("/trash/:id", dashboardController.getTrash);

// exporting the router
export default router;
