import { Schema, model, Types } from 'mongoose';

const likeSchema = new Schema(
  {
    blog: { type: Types.ObjectId, ref: 'blogs', required: true },
    user: { type: Types.ObjectId, ref: 'users', required: true },
  },
  { timestamps: true }
);

export const LikeModel = model('likes', likeSchema);
