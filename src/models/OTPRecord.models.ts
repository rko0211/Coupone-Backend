import mongoose, { Schema, Document, Types } from "mongoose";
// import { IUser } from "./User";

export interface IOTPRecord extends Document {
  userId: Types.ObjectId;
  userEmail: string;
  userPhone: string;
  otp?: string;
  createdAt: Date;
  expiresAt?: Date;
}

const OTPRecordSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique:true,
  },
  userPhone: {
    type: String,
    required: true,
    unique:true,
  },
  otp: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
});

export default mongoose.model<IOTPRecord>("OTPRecord", OTPRecordSchema);
