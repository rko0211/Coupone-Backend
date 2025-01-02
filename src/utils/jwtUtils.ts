const jwt = require("jsonwebtoken");
import { Response } from "express";

const SECRET_KEY = process.env.JWT_SECRET; // Use environment variables for production

/**
 * Generates a JWT token and stores it in a cookie.
 * @param res
 * @param payload
 * @param rememberMe
 * @param cookieName
 */
export const generateAndSetToken = (
  res: Response,
  payload: { id: number; email: string; phone: string },
  rememberMe: boolean = false,
  cookieName: string = "authToken"
): void => {
  // Generate a JWT token

  const token = jwt.sign(payload, SECRET_KEY);

  // Cookie options
  const cookieOptions: any = {
    httpOnly: true, // Prevents access by JavaScript
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "none", // Helps prevent CSRF attacks
  };

  // If rememberMe is true, set cookie expiration to 1 week
  if (rememberMe) {
    cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
  }

  // Set the cookie in the response
  res.cookie(cookieName, token, cookieOptions);
};
