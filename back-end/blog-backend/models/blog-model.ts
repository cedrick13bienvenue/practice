import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
