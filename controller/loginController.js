// controller to login the user

// importing the required modules
import { user } from "../model/user.js";

const loginController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      //   check if the user already exists
      const existingUser = await user.find({ email });

      if (existingUser.length == 0) {
        return res.status(404).json({ message: "user doesn't exist" });
      }

      res.status(200).json({ message: "user logged in successfully" });
    } catch (error) {
      console.error("error while signup", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default loginController;
