import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
  id: number;
  email: string;
  phone: string;
}

export async function findUser(user: User) {
  try {
    const userRecord = await prisma.oTPRecord.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { userEmail: user.email },
          { userPhone: user.phone },
        ],
      },
    });
    return userRecord;
  } catch (error) {
    // console.error("Error finding user:", error);
    throw new Error("Could not find user");
  }
}

export async function checkUser(useremail: string, userphone: string) {
  try {
    const userData = await prisma.user.findFirst({
      where: {
        OR: [{ email: useremail }, { phone: userphone }],
      },
    });
    return userData;
  } catch (error) {
    // console.error("Error checking user:", error);
    throw new Error("Could not check user");
  }
}

export async function checkOTPComplete(
  id: number,
  useremail: string,
  userphone: string
) {
  try {
    const userData = await prisma.user.findFirst({
      where: {
        OR: [{ id: id }, { email: useremail }, { phone: userphone }],
      },
    });
    return userData;
  } catch (error) {
    // console.error("Error checking OTP complete:", error);
    throw new Error("Could not check OTP complete");
  }
}

export async function verifyUser(useremail: string, userpassword: string) {
  try {
    const userData = await prisma.user.findFirst({
      where: {
        AND: [{ email: useremail }, { password: userpassword }],
      },
    });
    return userData;
  } catch (error) {
    // console.error("Error verifying user:", error);
    throw new Error("Could not verify user");
  }
}

export async function deleteOTPEntry(
  userId: number,
  userEmail: string,
  userPhone: string
) {
  try {
    const userRecord = await prisma.oTPRecord.findFirst({
      where: {
        OR: [
          { userId: userId },
          { userEmail: userEmail },
          { userPhone: userPhone },
        ],
      },
    });
    if (!userRecord) {
      throw new Error("User OTP does not exist");
    }
    try {
      const id = userRecord.id;
      try {
        const deletedUser = await prisma.oTPRecord.delete({
          where: { id },
        });
        console.log("Deleted user:", deletedUser);
      } catch (error) {
        throw new Error("some internal problem occured, please try latter!");
      }
    } catch (error: unknown) {
      throw new Error("some internal problem please try letter!");
    }
  } catch (error: unknown) {
    throw new Error("some internal problem occured, please try latter!");
  }
}
