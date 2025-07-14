import { Request, Response } from 'express';
import Blog from '../models/blog-model';

// CREATE
export const createBlog = async (req: Request, res: Response) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save blog' });
  }
};

// READ
export const getAllBlogs = async (_req: Request, res: Response) => {
  const blogs = await Blog.find().sort({ updated: -1 });
  res.json(blogs);
};

// UPDATE
export const updateBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated: new Date() },
    { new: true }
  );
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
};

// DELETE
export const deleteBlog = async (req: Request, res: Response) => {
  const result = await Blog.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ error: 'Blog not found' });
  res.json({ message: 'Blog deleted successfully' });
};
