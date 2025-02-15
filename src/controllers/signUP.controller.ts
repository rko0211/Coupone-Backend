import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/Users.models"; // Import your MongoDB User model
import { generateAndSetToken } from "../utils/generateAndSetToken"; // Your JWT generation utility

// Check if the user already exists
const checkUser = async (userEmail: string, userPhone: string) => {
  const user = await User.findOne({
    $or: [{ userEmail }, { userPhone }],
  });
  return user;
};

// Create a new user in MongoDB
const createNewUser = async (
  usercountrycode: string,
  userphone: string,
  useremail: string,
  password: string
): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    userCountrycode: usercountrycode,
    userPhone: userphone,
    userEmail: useremail,
    password: hashedPassword,
  });
  return newUser;
};

// Handle User Registration Process
export const signUP = asyncHandler(async (req: Request, res: Response) => {
  const { usercountrycode, userphone, useremail, password, confirmPassword } =
    req.body;

  if (
    !usercountrycode ||
    !userphone ||
    !useremail ||
    !password ||
    !confirmPassword
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await checkUser(useremail, userphone);

    if (existingUser) {
      return res
        .status(205)
        .json({ message: "User with this email or phone already exists!" });
    }

    if (password !== confirmPassword) {
      return res
        .status(208)
        .json({ message: "Password and Confirm Password should be same" });
    }

    const newUser: IUser = await createNewUser(
      usercountrycode,
      userphone,
      useremail,
      password
    );

    // Generate a JWT token
    const rememberMe = true; // Set based on user preference (e.g., from request body)
    generateAndSetToken(
      res,
      {
        id: newUser._id.toString(), // Convert ObjectId to string
        email: newUser.userEmail,
        phone: newUser.userPhone,
      },
      rememberMe
    );

    // Return success response
    return res.status(200).json({
      message: "Form Submitted Successfully!",
      user: {
        id: newUser._id,
        email: newUser.userEmail,
        phone: newUser.userPhone,
      },
    });
  } catch (error: unknown) {
    return res.status(500).json({
      message: "Please Try Later, Some internal error occurred!",
    });
  }
});
