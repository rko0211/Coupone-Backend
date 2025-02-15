import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { sendOTP } from "../utils/sendOTP";

export const sendOTPCode = asyncHandler(async (req: Request, res: Response) => {
  try {
    await sendOTP(req, res);
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ message: "Please Try Letter, Some internal error occured!" });
  }
});
