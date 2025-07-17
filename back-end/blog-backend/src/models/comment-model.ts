import { Schema, model, Types } from 'mongoose';

const commentSchema = new Schema(
  {
    blog: { type: Types.ObjectId, ref: 'blogs', required: true },
    user: { type: Types.ObjectId, ref: 'users', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const CommentModel = model('comments', commentSchema);
