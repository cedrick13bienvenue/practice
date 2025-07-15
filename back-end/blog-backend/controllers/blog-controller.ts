import { Request, Response } from 'express';
import Blog from '../models/blog-model';
import { ResponseService } from '../utils/response';
import { generateSlug } from '../utils/helper';

export const createBlog = async (req: Request, res: Response) => {
  const { title, description, author, content, isPublished } = req.body;

  const blog = new Blog({
    title,
    slug: generateSlug(title),
    description,
    author,
    content,
    isPublished,
  });

  const saved = await blog.save();
  ResponseService({ data: saved, message: 'Blog created', res });
};

export const getAllBlogs = async (_req: Request, res: Response) => {
  const blogs = await Blog.find();
  ResponseService({ data: { blogs }, message: 'All blogs', res });
};

export const getBlogById = async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return ResponseService({ res, status: 404, message: 'Blog not found', success: false });
  ResponseService({ data: blog, res });
};

export const deleteBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return ResponseService({ res, status: 404, message: 'Blog not found', success: false });
  ResponseService({ res, message: 'Blog deleted successfully' });
};
