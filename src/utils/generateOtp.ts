import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface User {
  id: number;
  email: string;
  phone: string;
}

export const generateOtp = (user: User) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // console.log(user);

  saveOTP(otp, user.id, user.email, user.phone);

  return otp; // Return OTP for sending to the user
};

const saveOTP = async (
  otp: string,
  userId: number,
  userEmail: string,
  userPhone: string
) => {
  try {
    // Ensure at least one identifier is provided (either userId, userEmail, or userPhone)
    if (!userId && !userEmail && !userPhone) {
      throw new Error(
        "At least one of userId, userEmail, or userPhone must be provided"
      );
    }

    // Find the user record using OR condition (userId, userEmail, or userPhone)
    try {
      const userRecord = await prisma.user.findFirst({
        where: {
          OR: [{ id: userId }, { email: userEmail }, { phone: userPhone }],
        },
      });

      if (userRecord) {
        try {
          const otpRecord = await prisma.oTPRecord.create({
            data: {
              userId: userId,
              userEmail: userEmail,
              userPhone: userPhone,
            },
          });
          try {
            const otpExpiresAt = new Date();
            otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1); // Set expiration to 10 minutes from now

            await prisma.oTPRecord.update({
              where: {
                id: otpRecord.id,
              },
              data: {
                otp: otp,
                expiresAt: otpExpiresAt,
              },
            });
          } catch (error: unknown) {
            throw new Error("Some Internal Eccor occured!");
          }
        } catch (error: unknown) {
          throw new Error("Some Internal Eccor occured!");
        }
      } else {
        throw new Error("User not found with the given identifier(s)");
      }
    } catch (error: unknown) {
      throw new Error("Some Internal Eccor occured!");
    }
  } catch (error: unknown) {
    throw new Error("Some Internal Eccor occured!");
  }
};
