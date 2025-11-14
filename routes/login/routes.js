// file to create the route for the login

// importing the required modules
import express from "express";
import passport from "passport";
import loginController from "../../controller/loginController.js";

// creating the router
const router = express.Router();

// router for login purpose
router.post("/", loginController.loginUser);

// router for google login and signup
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

// router for setting up the success route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  loginController.googleLogin
);

// router for github login and signup
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// router for setting up the success route
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  loginController.gitHubLogin
);

// exporting the router
export default router;
