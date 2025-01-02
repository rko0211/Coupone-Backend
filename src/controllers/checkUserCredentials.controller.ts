import { checkOTPComplete } from "../db/findUser.db";

export async function checkUserCredentials(
  userId: number,
  userEmail: string,
  userPhone: string
) {
  try {
    const userDetails = await checkOTPComplete(userId, userEmail, userPhone);
    if (!userDetails?.isEmailOTPVerificationComplete) {
      return "verifyAccount";
    } else if (!userDetails.isProfileComplete) {
      return "completeProfile";
    }
    return "ok";
  } catch (error: unknown) {
    throw new Error("Please try letter!");
  }
}
