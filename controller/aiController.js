// file to set up the controller for the AI part of the application

// importing the required modules
import { model } from "../ai/gemini.js";
import { historyModel } from "../model/history.js";
import { PROMPT_TEMPLATE } from "../ai/prompt/promptTemplate.js";

// creating the controller
const aiController = {
  // function to run and get the response from the ai
  runAi: async (req, res) => {
    try {
      const { language, service, prompt, code, userId } = req.body;

      if (!language || !service || !prompt) {
        return res
          .status(400)
          .json({ message: "Please provide all the required fields" });
      }

      const template = PROMPT_TEMPLATE[service];

      if (!template) {
        return res.status(400).json({ message: "Invalid service" });
      }

      const finalPrompt = template({ language, code, prompt });

      const result = await model.generateContent(finalPrompt);

      const output = result.response.text();

      res.status(200).json({ output });

      // generate the title in async way
      setImmediate(async () => {
        try {
          const titlePrompt = `
          Generate a concise and meaningful title (max 6 words)
          for this action:

          Mode: ${service}
          User Intent: ${prompt}
          No quotes., no trailing punctuation.
          `;

          const title = await model.generateContent(titlePrompt);

          const titleOutput = title.response.text();
          await historyModel.create({
            user: userId,
            title: titleOutput,
            language,
            service,
            prompt,
            code,
            output,
          });
          console.log("✔ History saved successfully");
        } catch (error) {
          console.error("❌ Failed to save history:", err);
        }
      });
    } catch (error) {
      console.error("error from the model ai", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "AI service unavailable. Try again later." });
      }
    }
  },
};

// exporting the controller
export default aiController;
