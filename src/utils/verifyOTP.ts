import { Request, Response } from "express";
import mongoose from "mongoose";
import { verifyOTPEmail } from "../email/transporter";
import OTPRecord from "../models/OTPRecord.models";
import User, { IUser } from "../models/Users.models";
/**
 * Verify OTP for a user.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { userOTP } = req.body; // OTP entered by the user
    const user = req.user; // Authenticated user from the request

    // Validate user data
    if (!user || !user.id || !user.email || !user.phone) {
      return res.status(400).json({ message: "Please register yourself!" });
    }
    const userId = new mongoose.Types.ObjectId(user.id);
    // Find the user's OTP record
    const userOTPRecord = await OTPRecord.findOne({
      // if all the conditions are satisfied in the query then only it return the record from database
      userId,
      userEmail: user.email,
      userPhone: user.phone,
    });

    if (!userOTPRecord) {
      return res.status(400).json({ message: "Please register yourself!" });
    }

    // Validate OTP record
    if (!userOTPRecord.expiresAt) {
      return res.status(500).json({
        message: "Some internal error occurred. Please try again later.",
      });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (userOTPRecord.expiresAt < currentTime) {
      return res
        .status(203)
        .json({ message: "OTP has expired. Please resend OTP!" });
    }

    // Verify the OTP
    if (userOTPRecord.otp !== userOTP) {
      return res
        .status(205)
        .json({ message: "Incorrect OTP. Please try again!" });
    }

    // Send OTP verification success email
    await verifyOTPEmail(user.email);

    // Mark OTP verification as complete
    const updatedUserRecord = await User.findOneAndUpdate(
      {
        userEmail: user.email,
        userPhone: user.phone,
      }, // Filter criteria to find the record
      {
        $set: {
          // Fields you want to update
          isEmailOTPVerificationComplete: true,
        },
      },
      {
        new: true, // Return the updated document
        upsert: false, // Do not create a new record if none is found
      }
    );
    if (!updatedUserRecord) {
      res.status(400).json({ message: "Please register yourself!" });
    }

    // Return success response
    return res.status(200).json({ message: "OTP verification successful!" });
  } catch (error: unknown) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "An internal error occurred. Please try again later.",
    });
  }
};
