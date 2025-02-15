import { Request, Response } from "express";
import { generateOtp } from "../utils/generateOtp";
import { OTPEmail } from "../email/transporter";
import OTPRecord from "../models/OTPRecord.models"; // Import the OTPRecord model

// Email OTP Post request Handle
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    // Check if user is authenticated and has required fields
    if (!user || !user.id || !user.email || !user.phone) {
      return res.status(400).json({ message: "Please register yourself!" });
    }

    // Generate OTP
    const otp = generateOtp().toString();

    // Save or update OTP in the database
    const otpRecord = await OTPRecord.findOneAndUpdate(
      { userId: user.id }, // Find by userId
      {
        userId: user.id, // User ID from the authenticated user
        userEmail: user.email.trim().toLowerCase(), // User email from the authenticated user
        userPhone: user.phone, // User phone from the authenticated user
        otp: otp, // Generated OTP
        createdAt: new Date(Date.now()),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
      },
      {
        upsert: true, // Create a new document if it doesn't exist
        new: true, // Return the updated document
      }
    );

    // Send OTP via email
    OTPEmail(otp, user.email);

    // Return success response
    return res.status(200).json({
      message: "OTP has been sent to your registered email account.",
      otp: otp, // For debugging purposes only (remove in production)
      email: user.email,
    });
  } catch (error: unknown) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ message: "Please try again later. An internal error occurred!" });
  }
};
