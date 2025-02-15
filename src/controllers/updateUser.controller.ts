import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/Users.models";
import mongoose from "mongoose";
import AddressRecord from "../models/AddressRecord.models";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      houseNo,
      country,
      citytownvillage,
      district,
      state,
    } = req.body;

    const user = req.user;
    if (!user || !user.id || !user.email || !user.phone) {
      return res.status(400).json({ message: "Please Registered Yourself!" });
    }

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !houseNo ||
      !country ||
      !citytownvillage ||
      !district ||
      !state
    ) {
      return res.status(210).json({ message: "Please complete all the field" });
    }
    const userId = new mongoose.Types.ObjectId(user.id);
    const obj = {
      userId,
      userEmail: user.email,
      userPhone: user.phone,
      firstName,
      middleName,
      houseno: houseNo,
      lastName,
      gender,
      houseNo,
      citytownvillage: citytownvillage,
      district,
      state,
      country,
    };
    try {
      const userRecord = await User.findOne({
        userEmail: obj.userEmail,
        userPhone: obj.userPhone,
      });
      if (!userRecord) {
        return res.status(400).json({ message: "Please Registered Yourself!" });
      }

      const newAddressRecord = await AddressRecord.create(obj);
      if (!newAddressRecord) {
        return res
          .status(500)
          .json({ message: "An error occurred while creating the user." });
      }

      // Mark Profile as complete
      const updatedUserRecord = await User.findOneAndUpdate(
        {
          userEmail: user.email,
          userPhone: user.phone,
        }, // Filter criteria to find the record
        {
          $set: {
            // Fields you want to update
            isProfileComplete: true,
          },
        },
        {
          new: true, // Return the updated document
          upsert: false, // Do not create a new record if none is found
        }
      );

      if (!updatedUserRecord) {
        res.status(400).json({ message: "Please register yourself!" });
      }

      return res.status(200).json({ message: "User Updated Successfully" });
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
