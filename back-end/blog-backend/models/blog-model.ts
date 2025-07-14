import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  name: { type: String, required: true, minlength: 3 },
  content: { type: String, required: true, minlength: 10 },
  updated: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;