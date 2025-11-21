// file to create the dashboard controller

// importing the required modules
import { historyModel } from "../model/history.js";
import { trashModel } from "../model/trash.js";
import { user } from "../model/user.js";

// controller
const dashboardController = {
  // for editing the user
  editUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      if (!id) {
        return res.status(400).json({ error: "user id is required" });
      }

      const updatedUser = await user.findByIdAndUpdate(
        id,
        { $set: { username, email } },
        { new: true }
      );

      if (updatedUser.length == 0) {
        return res.status(202).json({ error: "user not found and updated" });
      }

      return res.status(202).json({ message: "user updated successfully" });
    } catch (error) {
      console.error("error from the edit user", error);
      res.status(500).json({ error: error.message });
    }
  },

  // for getting the chat history for the user
  getChatHistory: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id is required" });
      }

      const user = await historyModel
        .find({ user: id, isDeleted: false })
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
      const deleteHistory = await historyModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );

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

  // for getting the trash data
  getTrash: async (req, res) => {
    try {
      const { id } = req.params;

      const trash = await trashModel
        .find({ user: id })
        .populate("history", "title")
        .sort({ createdAt: -1 });
      if (!trash || trash.length == 0) {
        return res.status(200).json({ trash: [] });
      }

      const formatted = trash.map((item) => ({
        id: item._id,
        historyId: item.history._id,
        title: item.history.title,
      }));

      return res.status(200).json({ trash: formatted });
    } catch (error) {
      console.error("error while fetching the trash", error);
      res.status(500).json({ error: error.message });
    }
  },

  // for restoring the trash
  restoreTrash: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id is required" });
      }

      const trash = await trashModel.findOne({ _id: id });

      if (!trash) {
        return res.status(202).json({ message: "Trash not found" });
      }

      const history = await historyModel.findByIdAndUpdate(
        trash.history,
        {
          $set: { isDeleted: false },
        },
        { new: true }
      );

      if (!history) {
        return res
          .status(500)
          .json({ message: "Error while restoring the history" });
      }

      await trashModel.findByIdAndDelete(id);

      res.status(202).json({ message: "History restored successfully" });
    } catch (error) {
      console.error("error while restoring the trash", error);
      res.status(500).json({ error: error.message });
    }
  },

  // for deleing permanently
  deletePermanent: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Id is required" });
      }

      const trash = await trashModel.findByIdAndDelete(id);

      if (!trash) {
        return res.status(202).json({ message: "Trash not found" });
      }

      const history = await historyModel.findByIdAndDelete(trash.history);

      if (!history) {
        return res.status(202).json({ message: "History not found" });
      }

      res.status(202).json({ message: "Trash deleted permanently" });
    } catch (error) {
      console.error("error while restoring the trash", error);
      res.status(500).json({ error: error.message });
    }
  },

  // for editing the title for the dashboard
  editTitle: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      console.log("title", title);

      if (!id || !title) {
        return res.status(400).json({ message: "Missing the required fields" });
      }

      const history = await historyModel.findByIdAndUpdate(
        id,
        { $set: { title } },
        { new: true }
      );

      if (!history) {
        return res.status(202).json({ message: "History not found" });
      }

      res.status(202).json({ message: "Title updated successfully" });
    } catch (error) {
      console.error("Error from the edit title", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default dashboardController;
