import { Request, Response } from "express";
import { generateOtp } from "../utils/generateOtp";
import { OTPEmail } from "../email/transporter";
// Email OTP Post request Handle
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id || !user.email || !user.phone) {
      return res.status(400).json({ message: "Please Registered Yourself!" });
    }

    // const id = user?.id;
    const otp = generateOtp(user!);
    // console.log(otp);
    OTPEmail(otp, user.email);
    return res.status(200).json({
      message: "OTP is Send to your registerd Email account",
      otp: otp,
      email: user?.email,
    });
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ message: "Please Try Letter, Some internal error occured!" });
  }
};
