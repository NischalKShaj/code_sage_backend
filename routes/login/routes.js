// file to create the route for the login

// importing the required modules
import express from "express";
import loginController from "../../controller/loginController.js";

// creating the router
const router = express.Router();

// router for login purpose
router.post("/", loginController.loginUser);

// exporting the router
export default router;
