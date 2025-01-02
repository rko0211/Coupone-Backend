// src/config/env.ts
import dotenv from "dotenv";

// Load environment variables from the root .env file
dotenv.config({ path: "./.env" });

console.log("Environment variables loaded."); // Optional for debugging
