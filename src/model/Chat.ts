import { Schema, model, models, Model, Types } from "mongoose";

export interface ChatInterfaceValue extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  tag: Types.ObjectId;
  message: String;
  seen: Boolean;
}

const ChatSchema = new Schema<ChatInterfaceValue>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Owner" || "People",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Owner" || "People",
      required: true,
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: "TagItem",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel =
  (models.Chat as Model<ChatInterfaceValue>) ||
  model<ChatInterfaceValue>("Chat", ChatSchema);

export default ChatModel;
