import { Schema, model, Document, models, Model, Types } from "mongoose";

export interface PaymentInterfaceValue extends Document {
  amount: number;
  church: Types.ObjectId;
  people: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentInterfaceValue>(
  {
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
    people: {
      type: Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentModel =
  (models.Payment as Model<PaymentInterfaceValue>) ||
  model<PaymentInterfaceValue>("Payment", PaymentSchema);

export default PaymentModel;
