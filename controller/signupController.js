// file to create the user controller

// importing the required modules
import { user } from "../model/user.js";

const signupController = {
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      //   check if the user already exists
      const existingUser = await user.find({ email });

      if (existingUser.length > 0) {
        return res.status(409).json({ message: "user already exists" });
      }

      const newUser = new user({ username, email, password });
      await newUser.save();
      res.status(201).json({ message: "user created successfully" });
    } catch (error) {
      console.error("error while signup", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default signupController;
