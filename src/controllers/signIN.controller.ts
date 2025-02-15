import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import User from "../models/Users.models"; // Import your MongoDB User model
import { generateAndSetToken } from "../utils/generateAndSetToken"; // Your JWT generation utility

// Check if the user already exists
const checkUser = async (useremail: string) => {
  const user = await User.findOne({
    $or: [{ userEmail: useremail }],
  });
  return user;
};

// Handle User SignIN Process
export const signIN = asyncHandler(async (req: Request, res: Response) => {
  const { useremail, userpassword, RememberMe } = req.body;

  // Check if all required fields are present
  if (!userpassword || !useremail) {
    return res
      .status(400)
      .json({ message: "Email/Phone and Password are required!" });
  }

  try {
    // Check if the user exists
    const existingUser = await checkUser(useremail);

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email!" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(
      userpassword,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // Generate a JWT token
    const rememberMe = RememberMe; // Set based on user preference (e.g., from request body)
    generateAndSetToken(
      res,
      {
        id: existingUser._id.toString(), // Convert ObjectId to string
        email: existingUser.userEmail,
        phone: existingUser.userPhone,
      },
      rememberMe
    );

    if (!existingUser.isEmailOTPVerificationComplete) {
      return res.status(203).json({ message: "Please Verify Your Account!" });
    }
    if (!existingUser.isProfileComplete) {
      return res.status(205).json({ message: "Please Complete Your Account!" });
    }

    // Return success response
    return res.status(200).json({
      message: "SignIN Successful!",
      user: {
        id: existingUser._id.toString(),
        email: existingUser.userEmail,
        phone: existingUser.userPhone,
      },
    });
  } catch (error: unknown) {
    console.error("Error during SignIN:", error);
    return res.status(500).json({
      message: "Please Try Later, Some internal error occurred!",
    });
  }
});
