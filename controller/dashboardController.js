// file to create the dashboard controller

// importing the required modules
import { historyModel } from "../model/history.js";
import { trashModel } from "../model/trash.js";

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

      const titles = user.map((t) => ({ id: t._id, title: t.title }));

      res.status(200).json({ title: titles });
    } catch (error) {
      console.error("error from the history", error);
      res.status(500).json({ error: error.message });
    }
  },

  // for deleting the specific chat history
  deleteChatHistory: async (req, res) => {
    try {
      const { id, userId } = req.params;

      // first need to find the history
      const history = await historyModel.findById(id);

      if (!history) {
        return res.status(200).json({ message: "History not found" });
      }

      // updating the trash db before removing from the history
      const updateTrash = await trashModel.create({
        user: userId,
        history: id,
      });

      if (!updateTrash) {
        return res.status(500).json({ message: "Error while updating trash" });
      }

      // deleting the history
      const deleteHistory = await historyModel.findByIdAndDelete(id);

      if (!deleteHistory) {
        return res
          .status(500)
          .json({ message: "Error while deleting history" });
      }

      res.status(200).json({ message: "History deleted successfully" });
    } catch (error) {
      console.error("error while deleting the chat history", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default dashboardController;
