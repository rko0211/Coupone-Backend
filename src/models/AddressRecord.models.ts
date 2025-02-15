import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAddressRecord extends Document {
  userId: Types.ObjectId;
  userEmail: string;
  userPhone: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  houseNo?: number;
  citytownvillage?: string;
  district?: string;
  state?: string;
  country?: string;
  createdAt: Date;
}

const AddressRecordSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: String,
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  houseNo: Number,
  citytownvillage: String,
  district: String,
  state: String,
  country: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IAddressRecord>(
  "AddressRecord",
  AddressRecordSchema
);
