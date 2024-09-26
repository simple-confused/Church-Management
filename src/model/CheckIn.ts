import { Schema, model, models, Model, Types } from "mongoose";

export interface CheckInInterfaceValue extends Document {
  event: Types.ObjectId;
  people: Types.ObjectId;
}

const CheckInSchema = new Schema<CheckInInterfaceValue>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    people: {
      type: Schema.Types.ObjectId,
      ref: "People",
    },
  },
  { timestamps: true }
);

const CheckInModel =
  (models.CheckIn as Model<CheckInInterfaceValue>) ||
  model<CheckInInterfaceValue>("CheckIn", CheckInSchema);

export default CheckInModel;
