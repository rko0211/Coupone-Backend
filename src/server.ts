import express from "express";
// import dotenv from "dotenv";
import "./config/env";
import path from "path";
import userRoutes from "./routes/user.routes";
import cors from "cors";
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
import connectDB from "./db";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS
// app.use(cors());

app.use(
  cors({
    // origin: "https://coupone.vercel.app", // Replace with your client URL
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Serve Static Files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/users", userRoutes);

// Serve Documentation Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start Server
connectDB().then(() => {
  app.on("error", (error: any) => console.log(`Error: ${error}`));
  app.listen(process.env.PORT || 3000, () =>
    console.log(`⚙️  Server🚀 is running on port ${process.env.PORT}✨`)
  );
});
