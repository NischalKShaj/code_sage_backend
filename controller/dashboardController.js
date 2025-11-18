// file to create the dashboard controller

// importing the required modules
import { historyModel } from "../model/history.js";

// controller
const dashboardController = {
  // for getting the chat history for the user
  getChatHistory: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id is required" });
      }

      const user = await historyModel
        .find({ user: id })
        .sort({ createdAt: -1 });

      if (user.length === 0) {
        return res.status(200).json({ title: [] });
      }

      const titles = user.map((t) => t.title);

      res.status(200).json({ title: titles });
    } catch (error) {
      console.error("error from the history", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default dashboardController;
