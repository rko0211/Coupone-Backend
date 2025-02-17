import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFilterProductsRecord extends Document {
  companyImage: string;
  discountText: string;
  discountImage: string;
}

const FilterProductsRecordSchema: Schema = new Schema({
  companyImage: {
    type: String,
    required: true,
  },
  discountText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IFilterProductsRecord>(
  "FilterProductsRecord",
  FilterProductsRecordSchema
);
