import express from "express";

import CartItemsRecord from "../models/CartItems.models";

const sendCartItems = async (req: express.Request, res: express.Response) => {
  try {
    // Fetch all documents from the CartItemsRecord collection
    const cartItems = await CartItemsRecord.find();

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    // Send the cart items as a JSON response
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default sendCartItems;
