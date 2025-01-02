import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { createNewUser } from "../db/userCreate.db";
import { checkUser, verifyUser } from "../db/findUser.db";
import { updateUserDetails } from "../db/updateUserDetails.db";
import { checkUserCredentials } from "./checkUserCredentials.controller";
import { generateAndSetToken } from "../utils/jwtUtils";
import { sendOTP } from "../utils/sendOTP";
import { verifyOTP } from "../utils/verifyOTP";

// Handle User Registration Process
export const signUP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { usercountrycode, userphone, useremail, password, confirmPassword } =
      req.body;
    // console.log(req.body);

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
          .json({ message: "Passowrd and Confirm Password should be same" });
      }
      try {
        // Create a new user in the database
        const newUser = await createNewUser(
          usercountrycode,
          userphone,
          useremail,
          password
        );

        // Generate a JWT token

        const RememberMe = true;
        generateAndSetToken(
          res,
          {
            id: newUser.id,
            email: newUser.email,
            phone: newUser.phone,
          },
          RememberMe
        );

        // Return success response
        return res.status(200).json({
          message: "Form Submitted Successfully!",
          user: {
            id: newUser.id,
            email: newUser.email,
            phone: newUser.phone,
          },
        });
      } catch (error: unknown) {
        return res.status(500).json({
          message: "Please Try Letter, Some internal error occured!",
        });
      }
    } catch (error: unknown) {
      return res
        .status(500)
        .json({ message: "Please Try Letter, Some internal error occured!" });
    }
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ message: "Please Try Letter, Some internal error occured!" });
  }
});

// Send OTP:
export const sendOTPCode = asyncHandler(async (req: Request, res: Response) => {
  try {
    sendOTP(req, res);
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ message: "Please Try Letter, Some internal error occured!" });
  }
});

// Verify OTP

export const verifyOTPCode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      verifyOTP(req, res);
    } catch (error: unknown) {
      return res
        .status(500)
        .json({ message: "Please Try Letter, Some internal error occured!" });
    }
  }
);

// Update rest of the details of the user in the database
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      houseNo,
      country,
      city,
      district,
      state,
    } = req.body;

    const user = req.user;
    if (!user || !user.id || !user.email || !user.phone) {
      return res.status(400).json({ message: "Please Registered Yourself!" });
    }

    const obj = {
      firstName,
      middleName,
      lastName,
      gender,
      houseNo,
      country,
      city,
      district,
      state,
      userId: user.id,
      email: user.email,
      phone: user.phone,
    };
    try {
      const newUser = await updateUserDetails(obj);
      console.log("New USER", newUser);
      return res.status(200).json(newUser);
    } catch (error: unknown) {
      return res.status(205).json({
        message:
          "Address and other information already exists for the user. Skipping creation",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
});

// SignIn Logic
export const signIn = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { useremail, userpassword, RememberMe } = req.body;
    try {
      const userRecord = await verifyUser(useremail, userpassword);
      if (!userRecord) {
        // console.log("Not found");
        return res
          .status(400)
          .json({ message: "Please Enter Correct Email and Password!" });
      }
      console.log(userRecord);

      // Generate a JWT token
      generateAndSetToken(
        res,
        {
          id: userRecord.id,
          email: userRecord.email,
          phone: userRecord.phone,
        },
        RememberMe
      );
      console.log("error 3");

      try {
        const checkCredentials = await checkUserCredentials(
          userRecord.id,
          userRecord.email,
          userRecord.phone
        );

        // console.log(checkCredentials);
        if (checkCredentials === "verifyAccount") {
          res.status(203).json({ message: "Please Verify Your Account!" });
        } else if (checkCredentials === "completeProfile") {
          res.status(205).json({ message: "Please Complete Your Account!" });
        }
        // Return success response
        return res.status(200).json({
          message: "Form Submitted Successfully!",
          user: {
            id: userRecord.id,
            email: userRecord.email,
            phone: userRecord.phone,
          },
        });
      } catch (error: unknown) {
        return res.status(500).json({
          message: "Please Try Letter, Some internal error occured!",
        });
      }
    } catch (error: unknown) {
      return res
        .status(500)
        .json({ message: "Please Try Letter, Some internal error occured!" });
    }
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ message: "Please Try Letter, Some internal error occured!" });
  }
});
