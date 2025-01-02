import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createNewUser(
  usercountrycode: string,
  userphone: string,
  useremail: string,
  password: string
) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: useremail,
        countrycode: usercountrycode,
        phone: userphone,
        password: password, // Store hashed password
        isProfileComplete: false,
        createdAt: new Date(),
      },
    });

    // await prisma.oTPRecord.create({
    //   data: {
    //     userId: newUser.id,
    //     userEmail: newUser.email,
    //     userPhone: newUser.phone,
    //   },
    // });

    return newUser;
  } catch (error: unknown) {
    throw new Error("Some Internal Eccor occured!");
  }
}
