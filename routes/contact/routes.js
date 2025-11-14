// file to create the route for the contact section

// importing the required modules
import express from "express";
import contactController from "../../controller/contactController.js";

// creating the router
const router = express.Router();

// router for accepting the contact
router.post("/", contactController.contact);

// exporting the router
export default router;
