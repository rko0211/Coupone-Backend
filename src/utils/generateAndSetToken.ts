const jwt = require("jsonwebtoken");
import { Response } from "express";

// Validate JWT_SECRET environment variable
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not defined.");
}

// Define the payload type for the JWT token
interface TokenPayload {
  id: string;
  email: string;
  phone: string;
}

// Define the cookie options type
interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge?: number;
}

/**
 * Generates a JWT token and stores it in an HTTP-only cookie.
 * @param res - Express response object.
 * @param payload - Payload to include in the JWT token (id, email, phone).
 * @param rememberMe - Whether to extend the cookie expiration (default: false).
 * @param cookieName - Name of the cookie to set (default: "authToken").
 * @throws {Error} If JWT token generation fails.
 */
export const generateAndSetToken = (
  res: Response,
  payload: TokenPayload,
  rememberMe: boolean = false,
  cookieName: string = "authToken"
): void => {
  try {
    // Generate the JWT token
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "1d", // Token expires in 7 days if rememberMe is true, otherwise 1 day
    });

    // Define cookie options
    const cookieOptions: CookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
    };

    // Extend cookie expiration if rememberMe is true
    if (rememberMe) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    }

    // Set the cookie in the response
    res.cookie(cookieName, token, cookieOptions);
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate JWT token.");
  }
};

/**
 * Clears the JWT token cookie (used for logout).
 * @param res - Express response object.
 * @param cookieName - Name of the cookie to clear (default: "authToken").
 */
export const clearTokenCookie = (
  res: Response,
  cookieName: string = "authToken"
): void => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
