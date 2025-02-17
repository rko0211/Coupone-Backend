import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as fs from "fs";
import dotenv from "dotenv";
// import DriverRegistration from "../models/driverRegistration.models";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
  localFilePath: string | null,
  folder: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "Coupone_Card_Items",
    });

    console.log("File uploaded to Cloudinary:", response.secure_url);
    return response;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);

    // Safely remove file if upload fails
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        console.log("Temporary file deleted:", localFilePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }

    return null;
  }
};

export default uploadOnCloudinary;
