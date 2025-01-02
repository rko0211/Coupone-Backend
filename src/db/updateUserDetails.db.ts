import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  houseNo: number;
  country: string;
  city: string;
  district: string;
  state: string;
  userId: number;
  email: string;
  phone: string;
}

export async function updateUserDetails(user: User) {
  try {
    // Check if the user already has an address
    try {
      const existingAddress = await prisma.addressRecord.findFirst({
        where: {
          userId: user.userId,
        },
      });

      if (existingAddress) {
        // console.log("Address already exists for the user. Skipping creation.");
        throw new Error("User Address already exists");
      }
    } catch (error) {
      // console.error("Error checking existing address:", error);
      throw new Error("Failed to check existing address");
    }

    // Create a new address record
    let newAddressRecord;
    try {
      newAddressRecord = await prisma.addressRecord.create({
        data: {
          userId: user.userId,
          userEmail: user.email,
          userPhone: user.phone,
          houseno: Number(user.houseNo),
          citytownvillage: user.city,
          district: user.district,
          state: user.state,
          country: user.country,
        },
      });
    } catch (error) {
      // console.error("Error creating new address record:", error);
      throw new Error("Failed to create address record");
    }

    // Validate user existence
    let userExists;
    try {
      userExists = await prisma.user.findUnique({
        where: { id: user.userId },
      });

      if (!userExists) {
        throw new Error("User does not exist");
      }
    } catch (error) {
      // console.error("Error validating user existence:", error);
      throw new Error("Failed to validate user existence");
    }

    // Update user details
    try {
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          gender: user.gender,
          isProfileComplete: true,
        },
      });
    } catch (error) {
      // console.error("Error updating user details:", error);
      throw new Error("Failed to update user details");
    }

    return newAddressRecord;
  } catch (error) {
    // console.error("Error in updateUserDetails:", error);
    throw error;
  }
}

export async function updateOTPDetails(
  userId: number,
  userEmail: string,
  userPhone: string
) {
  try {
    // Update user details
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isEmailOTPVerificationComplete: true,
      },
    });
    return updatedUser;
  } catch (error) {
    // console.error("Error in updateOTPDetails:", error);
    throw new Error("Failed to update OTP details");
  }
}
