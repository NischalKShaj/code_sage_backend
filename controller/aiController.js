// file to set up the controller for the AI part of the application

// importing the required modules
import { model } from "../ai/gemini.js";
import { historyModel } from "../model/history.js";

// creating the controller
const aiController = {
  // function to run and get the response from the ai
  runAi: async (req, res) => {
    try {
      const { language, service, prompt, code } = req.body;

      if (!language || !service || !prompt) {
        return res
          .status(400)
          .json({ message: "Please provide all the required fields" });
      }

      const basePrompt = `
          You are CodeSage an elite coding assistant
          Task: ${service}
          Language :${language}
          Instructions: ${prompt}

        ${code ? `User Code:\n${code}` : ""}

        Return clean, formatted output.
      `;

      const result = await model.generateContent(basePrompt);

      const output = result.response.text();

      res.status(200).json({ output });

      const titlePrompt = `
          Generate a concise and meaningful title (max 6 words)
          for this action:

          Task: ${service}
          Prompt: ${prompt}

          No quotes, no trailing punctuation.
          `;

      const title = await model.generateContent(titlePrompt);

      const titleOutput = title.response.text();

      setImmediate(async () => {
        try {
          await historyModel.create({
            user: req.userId,
            title: titleOutput,
            language,
            service,
            prompt,
            code,
            output,
          });

          console.log("✔ History saved successfully");
        } catch (err) {
          console.error("❌ Failed to save history:", err);
        }
      });

      console.log("testing save will work or not");
    } catch (error) {
      console.error("error from the model ai", error);
      res.status(500).json({ error: error });
    }
  },
};

// exporting the controller
export default aiController;
