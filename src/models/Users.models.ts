import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  userEmail: string;
  userCountrycode: string;
  userPhone: string;
  password: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  isEmailOTPVerificationComplete: boolean;
  isPhoneOTPVerificationComplete: boolean;
  isProfileComplete: boolean;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  userEmail: {
    type: String,
    unique: true,
    required: true,
  },
  userCountrycode: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  middleName: String,
  lastName: String,
  gender: String,
  isEmailOTPVerificationComplete: {
    type: Boolean,
    default: false,
  },
  isPhoneOTPVerificationComplete: {
    type: Boolean,
    default: false,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
