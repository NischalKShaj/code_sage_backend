// file to create the user controller

// importing the required modules
import { user } from "../model/user.js";
import bcrypt from "bcryptjs";

const signupController = {
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      //   check if the user already exists
      const existingUser = await user.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ message: "user already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = new user({ username, email, password: hashPassword });
      await newUser.save();
      res.status(201).json({ message: "user created successfully" });
    } catch (error) {
      console.error("error while signup", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default signupController;
