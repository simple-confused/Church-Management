import { Schema, model, Document, models, Model } from "mongoose";

export interface AdminInterfaceValue extends Document {
  email: string;
  password: string;
  name: string;
  image: string;
  refresh_token: string;
  is_verified: boolean;
  verify_code: string;
  verify_expiry: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminInterfaceValue>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String,
    },
    verify_code: {
      type: String,
    },
    verify_expiry: {
      type: Number,
    },
  },
  { timestamps: true }
);

const AdminModel =
  (models.Admin as Model<AdminInterfaceValue>) ||
  model<AdminInterfaceValue>("Admin", AdminSchema);

export default AdminModel;
