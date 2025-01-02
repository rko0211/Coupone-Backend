import { Request, Response } from "express";
import { checkOTPComplete, deleteOTPEntry, findUser } from "../db/findUser.db";
import { updateOTPDetails } from "../db/updateUserDetails.db";
import { verifyOTPEmail } from "../email/transporter";
// Verify OTP

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { userOTP } = req.body;
    const user = req.user;
    if (!user || !user.id || !user.email || !user.phone) {
      return res.status(400).json({ message: "Please Registered Yourself!" });
    }
    const userRecord = await findUser(user!);
    if (!userRecord) {
      res.status(400).json({ message: "Please Registered Yourself!" });
    }

    // console.log(userRecord);
    if (!userRecord?.expiresAt) {
      return res
        .status(400)
        .json({ message: "Some Internal Error Occured, Please try letter" });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (userRecord?.expiresAt! < currentTime) {
      deleteOTPEntry(user.id, user.email, user.phone);
      return res.status(203).json({ message: "Please Resend OTP again!" });
    }

    if (userRecord?.otp !== userOTP) {
      return res.status(205).json({ message: "Please Enter Correct OTP!" });
    }

    try {
      const userRecord = await checkOTPComplete(
        user.id,
        user.email,
        user.phone
      );

      if (!userRecord) {
        return res.status(400).json({ message: "Please Registered Yourself!" });
      }
      const userDetails = await updateOTPDetails(
        user.id,
        user.email,
        user.phone
      );

      // console.log("OTP ", userDetails);
      verifyOTPEmail(user.email);
      return res.status(200).json({ message: "OTP verification sucessfull" });
    } catch (error: unknown) {
      return res
        .status(500)
        .json({ message: "Please Try Latter, Some internal error occured!" });
    }
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ message: "Please Try Latter, Some internal error occured!" });
  }
};
