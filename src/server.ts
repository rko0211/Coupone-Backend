import express from "express";
// import dotenv from "dotenv";
import "./config/env";
import path from "path";
import userRoutes from "./routes/user.routes";
import cors from "cors";
const cookieParser = require("cookie-parser");

const prisma = require("@prisma/client").PrismaClient;

// Load environment variables
// dotenv.config();

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
    origin: "http://localhost:5173", // Replace with your client URL
    credentials: true,
  })
);

const prismaClient = new prisma();

// This is just for testing purpose on Postman like platform
// Route to get all OTPRecords
app.get("/otp-records", async (req, res) => {
  try {
    const otpRecords = await prismaClient.oTPRecord.findMany(); // Retrieve all records
    res.json(otpRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch OTP records" });
  }
});
// To get all user details
app.get("/userdetails", async (req, res) => {
  try {
    const users = await prismaClient.user.findMany({
      include: {
        AddressRecords: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch userDetails records" });
  }
});

// Serve Static Files
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/users", userRoutes);

// Serve Documentation Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
