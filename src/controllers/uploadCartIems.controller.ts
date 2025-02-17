import express from "express";
import fs from "fs";
import path from "path";
import uploadOnCloudinary from "../utils/cloudinary";
import CartItemsRecord from "../models/CartItems.models";

// Function to delete all files in a directory
const deleteAllFilesInDir = (dirPath: string) => {
  try {
    // Read all files in the directory
    const files = fs.readdirSync(dirPath);

    // Delete each file
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    return;
  }
};

const uploadCartItems = async (req: express.Request, res: express.Response) => {
  try {
    // Check if files were uploaded
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files as {
      companyImage: Express.Multer.File[];
      discountImage: Express.Multer.File[];
    };

    // Upload companyImage to Cloudinary
    const companyImageResponse = await uploadOnCloudinary(
      files.companyImage[0].path,
      "company_images" // Folder in Cloudinary
    );

    if (!companyImageResponse) {
      return res
        .status(500)
        .json({ message: "Failed to upload company image" });
    }

    // Upload discountImage to Cloudinary
    const discountImageResponse = await uploadOnCloudinary(
      files.discountImage[0].path,
      "discount_images" // Folder in Cloudinary
    );

    if (!discountImageResponse) {
      return res
        .status(500)
        .json({ message: "Failed to upload discount image" });
    }

    // Create a new CartItemsRecord document
    const newCartItem = new CartItemsRecord({
      companyImage: companyImageResponse.secure_url, // Cloudinary URL
      discountText: req.body.discountText, // From request body
      discountImage: discountImageResponse.secure_url, // Cloudinary URL
    });

    // Save the document to the database
    await newCartItem.save();
    deleteAllFilesInDir("./public/img");
    // Respond with the saved document
    res.status(201).json(newCartItem);
  } catch (error: unknown) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default uploadCartItems;
