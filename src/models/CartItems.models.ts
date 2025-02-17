import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItemsRecord extends Document {
  companyImage: string;
  discountText: string;
  discountImage: string;
}

const CartItemsRecordSchema: Schema = new Schema({
  companyImage: {
    type: String,
    required: true,
  },
  discountText: {
    type: String,
    required: true,
  },
  discountImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICartItemsRecord>(
  "CartItemsRecord",
  CartItemsRecordSchema
);
