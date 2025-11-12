// controller to login the user

// importing the required modules
import { user } from "../model/user.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/generateToken.js";

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
};

export default loginController;
