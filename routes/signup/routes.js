// file to create the route for the signup

// importing the required modules
import express from "express";
import signupController from "../../controller/signupController.js";

// creating the router
const router = express.Router();

// router for signup the user
router.post("/", signupController.createUser);

// exporting the router
export default router;
