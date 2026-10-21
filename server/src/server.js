import app from "./app.js";
import { config } from "./config/env.js";
import { connectDB, closeDB } from "./db/mongodb.js";

async function startServer() {
  try {
    console.log("-----------------------------------------");
    console.log("Starting Portfolio Backend Server (MongoDB Engine)...");
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Target Port: ${config.port}`);

    // Connect to MongoDB & run initial auto-seed if needed
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`Portfolio API Server listening at http://localhost:${config.port}`);
      console.log(`Allowed Client URL: ${config.clientUrl}`);
      console.log(`Database: MongoDB (${config.mongodbUri})`);
      console.log(`Ready for incoming REST requests.`);
      console.log("-----------------------------------------");
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down server gracefully...`);
      server.close(async () => {
        try {
          await closeDB();
          console.log("MongoDB connection closed.");
        } catch (e) {
          console.error("Error closing MongoDB:", e);
        }
        console.log("Server closed. Process terminated.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Fatal error starting server:", err);
    process.exit(1);
  }
}

startServer();
