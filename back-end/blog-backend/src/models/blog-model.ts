import mongoose, { Schema, model } from 'mongoose';

const blogSchema = new Schema({
  title: String,
  slug: String,
  description: String,
  author: String,
  content: String,
  image: { type: String, default: null }, 
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

export const blogModel = model('blogs', blogSchema);
