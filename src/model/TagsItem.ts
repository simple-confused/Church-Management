import { Schema, model, models, Model, Types } from "mongoose";

export interface TagItemInterfaceValue extends Document {
  name: string;
  tag_group: Types.ObjectId;
  church: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TagItemSchema = new Schema<TagItemInterfaceValue>(
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
    tag_group: {
      type: Schema.Types.ObjectId,
      ref: "TagGroup",
    },
  },
  { timestamps: true }
);

const TagItemModel =
  (models.TagItem as Model<TagItemInterfaceValue>) ||
  model<TagItemInterfaceValue>("TagItem", TagItemSchema);

export default TagItemModel;
