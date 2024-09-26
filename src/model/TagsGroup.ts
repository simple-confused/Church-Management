import { Schema, model, models, Model, Types } from "mongoose";

export interface TagGroupInterfaceValue extends Document {
  name: string;
  church: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TagGroupSchema = new Schema<TagGroupInterfaceValue>(
  {
    name: {
      type: String,
      required: true,
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  { timestamps: true }
);

const TagGroupModel =
  (models.TagGroup as Model<TagGroupInterfaceValue>) ||
  model<TagGroupInterfaceValue>("TagGroup", TagGroupSchema);

export default TagGroupModel;
