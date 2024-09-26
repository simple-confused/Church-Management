import { Schema, model, models, Model, Types } from "mongoose";

export interface PeopleInterfaceValue extends Document {
  name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "others";
  address: string;
  church: Types.ObjectId;
  date_of_birth: string;
  image: string;
  password: string;
  refresh_token: string;
  is_verified: boolean;
  verify_code: string;
  verify_expiry: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const PeopleSchema = new Schema<PeopleInterfaceValue>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    refresh_token: {
      type: String,
    },
    is_verified: {
      type: Boolean,
      default: false,
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

const PeopleModel =
  (models.People as Model<PeopleInterfaceValue>) ||
  model<PeopleInterfaceValue>("People", PeopleSchema);

export default PeopleModel;
