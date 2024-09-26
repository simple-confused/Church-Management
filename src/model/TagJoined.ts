import { Schema, model, models, Model, Types } from "mongoose";

export interface TagJoinedInterfaceValue extends Document {
  tag_item: Types.ObjectId;
  people: Types.ObjectId;
}

const TagJoinedSchema = new Schema<TagJoinedInterfaceValue>({
  tag_item: {
    type: Schema.Types.ObjectId,
    ref: "TagItem",
  },
  people: {
    type: Schema.Types.ObjectId,
    ref: "People",
  },
});

const TagJoinedModel =
  (models.TagJoined as Model<TagJoinedInterfaceValue>) ||
  model<TagJoinedInterfaceValue>("TagJoined", TagJoinedSchema);

export default TagJoinedModel;
