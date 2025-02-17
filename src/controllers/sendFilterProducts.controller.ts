import express from "express";

import FilterProduct from "../models/FilterProducts.models";

const sendFilterProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Fetch all documents from the CartItemsRecord collection
    const filterProducts = await FilterProduct.find();

    if (!filterProducts || filterProducts.length === 0) {
      return res.status(404).json({ message: "No cart items found" });
    }

    // Send the cart items as a JSON response
    res.status(200).json(filterProducts);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default sendFilterProducts;
