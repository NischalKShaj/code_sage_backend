// controller to login the user

// importing the required modules
import { user } from "../model/user.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const loginController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      //   check if the user already exists
      const existingUser = await user.findOne({ email });

      if (existingUser.length == 0) {
        return res.status(404).json({ message: "user doesn't exist" });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const access_token = generateAccessToken(
        existingUser.id,
        existingUser.email
      );

      const refresh_token = generateRefreshToken(
        existingUser.id,
        existingUser.email
      );

      // update the refresh token for the user
      await user.findByIdAndUpdate(
        existingUser._id,
        { $set: { refreshToken: refresh_token } },
        { new: true }
      );

      res.status(200).json({
        message: "user logged in successfully",
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        },
        access_token,
        refresh_token,
      });
    } catch (error) {
      console.error("error while signup", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // login user with google
  googleLogin: async (req, res) => {
    try {
      const googleUser = req.user;

      const access_token = generateAccessToken(
        googleUser._id,
        googleUser.email
      );

      const refresh_token = googleUser.refreshToken;

      // for the redirect
      const redirectURL =
        `${process.env.FRONTEND_URL}/auth/google?` +
        `id=${googleUser._id}&` +
        `username=${encodeURIComponent(googleUser.username)}&` +
        `email=${encodeURIComponent(googleUser.email)}&` +
        `access_token=${access_token}&` +
        `refresh_token=${refresh_token}`;

      res.redirect(redirectURL);
    } catch (error) {
      console.error("error from the google login", error);
      res.status(500).json({ error: error.message });
    }
  },

  // login user with github
  gitHubLogin: async (req, res) => {
    try {
      const githubUser = req.user;

      const access_token = generateAccessToken(
        githubUser._id,
        githubUser.email
      );

      const refresh_token = githubUser.refreshToken;

      // for the redirect
      const redirectURL =
        `${process.env.FRONTEND_URL}/auth/github?` +
        `id=${githubUser._id}&` +
        `username=${encodeURIComponent(githubUser.username)}&` +
        `email=${encodeURIComponent(githubUser.email)}&` +
        `access_token=${access_token}&` +
        `refresh_token=${refresh_token}`;

      res.redirect(redirectURL);
    } catch (error) {
      console.error("Error from the github login", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default loginController;
