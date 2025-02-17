import express from "express";
import fs from "fs";
import uploadOnCloudinary from "../utils/cloudinary";
import FilterProductsRecord from "../models/FilterProducts.models";

const uploadProducts = async (req: express.Request, res: express.Response) => {
  try {
    // Check if files were uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePath = req.file.path;

    // Upload companyImage to Cloudinary
    const companyImageResponse = await uploadOnCloudinary(
      filePath,
      "FilterProduct_company_images" // Folder in Cloudinary
    );

    if (!companyImageResponse) {
      return res
        .status(500)
        .json({ message: "Failed to upload company image" });
    }

    // Create a new CartItemsRecord document
    const newCartItem = new FilterProductsRecord({
      companyImage: companyImageResponse.secure_url, // Cloudinary URL
      discountText: req.body.discountText, // From request body
    });

    // Save the document to the database
    await newCartItem.save();
    // Delete the specific file that was uploaded
    fs.unlinkSync(filePath);
    // Respond with the saved document
    res.status(201).json(newCartItem);
  } catch (error: unknown) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default uploadProducts;
