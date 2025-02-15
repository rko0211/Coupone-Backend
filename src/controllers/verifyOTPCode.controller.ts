import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { verifyOTP } from "../utils/verifyOTP";
export const verifyOTPCode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await verifyOTP(req, res);
    } catch (error: unknown) {
      return res
        .status(500)
        .json({ message: "Please Try Letter, Some internal error occured!" });
    }
  }
);
