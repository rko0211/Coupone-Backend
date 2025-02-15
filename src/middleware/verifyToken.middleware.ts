import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

// Validate JWT_SECRET environment variable
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined.");
}

// Extend Express Request interface to include `user` property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; phone: string };
    }
  }
}

/**
 * Middleware to verify JWT token and attach user data to the request object.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  // Retrieve token from cookies or Authorization header
  const token =
    req.cookies.authToken || req.headers.authorization?.split(" ")[1];

  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    res.status(401).json({ message: "Authentication token is required." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      phone: string;
    };

    // Attach user data to the request object
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token." });
    } else {
      res.status(500).json({ message: "Internal server error." });
    }
  }
};

export { verifyToken };
