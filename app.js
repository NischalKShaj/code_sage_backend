// file to create the main server for the application

// importing the required modules
import express from "express";
import { retryWait } from "./utils/retryWait.js";
import dotenv from "dotenv";
import cors from "cors";
import corsOptions from "./config/cors.js";
import signupRouter from "./routes/signup/routes.js";
import loginRouter from "./routes/login/routes.js";
import openAiRouter from "./routes/openAi/routes.js";
import dashboardRouter from "./routes/dashboard/routes.js";
import { connect } from "./config/db.js";

// configuring the dotenv
dotenv.config();

// max retries and max number of connections
const MAX_RETRIES = 5;
const MAX_CONNECTIONS = 15;
const RETRY_DELAY = 2000; // in milliseconds

// setting up the app
const app = express();
let serverInstance = null;
let activeConnections = 0;

// setting up the express
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1gb" }));

// connecting to the database
connect();

// setting up the cors
app.use(cors(corsOptions));

// middleware to track active connections\
app.use((req, res, next) => {
  if (activeConnections > MAX_CONNECTIONS) {
    console.warn("⚠️ Max connection limit reached!");
    res
      .status(503)
      .json({ success: false, message: "Server busy. Please try again later" });
  }

  activeConnections++;
  console.log("active connections ", activeConnections);

  res.on("finish", () => {
    activeConnections--;
  });

  next();
});

// setup the routes
app.use("/dashboard", dashboardRouter);
app.use("/login", loginRouter);
app.use("/openai", openAiRouter);
app.use("/signup", signupRouter);

// creating the server
const server = async () => {
  let retry = 1;
  while (retry <= MAX_RETRIES) {
    try {
      serverInstance = app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
      });

      // handling the run time errors
      serverInstance.on("error", async (err) => {
        if (err.code === "EADDRINUSE") {
          console.log("This address si already in use try another");
        } else {
          console.log("server crashed", err);
        }
        await retryWait(RETRY_DELAY);
        retry++;

        if (attempt <= MAX_RETRIES) {
          console.log(`🔁 Restart attempt ${retry}/${MAX_RETRIES}`);
          startServer();
        } else {
          console.error("🚫 Max retry attempts reached. Exiting...");
          process.exit(1);
        }
      });

      await retryWait(RETRY_DELAY);
      retry++;
      break; // exit the loop if server starts successfully
    } catch (error) {
      console.error(`⚠️ Attempt ${retry} failed: ${error.message}`);
      await retryWait(RETRY_DELAY);
      retry++;
    }
  }
};

// starting the server
server();
