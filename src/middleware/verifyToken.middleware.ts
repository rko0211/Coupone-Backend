import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const SECRET_KEY = "Prakash123@"; // Replace with a secure key in production

// Extend Express Request interface to include `user` property
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string; phone: string };
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.authToken; // Retrieve token from cookies

  if (!token) {
    res.status(401).json({ message: "Authentication token is required." });
  }

  try {
    // Decode and verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: number;
      email: string;
      phone: string;
    };

    // Attach user data to the request object
    req.user = decoded;

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export { verifyToken };
