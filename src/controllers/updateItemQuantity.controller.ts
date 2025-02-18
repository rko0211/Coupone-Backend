import express from "express";
import mongoose, { Schema, Types } from "mongoose";
import CartItemsRecord from "../models/CartItems.models";

const updateItemQuantity = async (
  req: express.Request,
  res: express.Response
) => {
  const { quantity, dbID } = req.body;

  const objectId = new mongoose.Types.ObjectId(dbID);

  try {
    const item = await CartItemsRecord.findOneAndUpdate(
      { _id: objectId },
      { itemQuantity: quantity >= 0 ? quantity : 0 },
      { new: true } // This option returns the updated document
    );

    if (!item) {
      return res.status(404).json({ message: "No Items Found" });
    }
    console.log(item);
    res.status(200).json({ Response: item });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default updateItemQuantity;
