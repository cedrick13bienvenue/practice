import fs from 'fs';
import { Request, Response } from 'express';

const BLOG_FILE = 'blog-data.json';
if (!fs.existsSync(BLOG_FILE)) fs.writeFileSync(BLOG_FILE, '[]');

const readBlogs = (): any[] => JSON.parse(fs.readFileSync(BLOG_FILE, 'utf-8'));
const writeBlogs = (blogs: any[]) => fs.writeFileSync(BLOG_FILE, JSON.stringify(blogs, null, 2));

export const createBlog = (req: Request, res: Response) => {
  const newBlog = {
    id: Date.now().toString(),
    title: req.body.title,
    name: req.body.name,
    content: req.body.content,
    updated: new Date().toISOString(),
  };

  const blogs = readBlogs();
  blogs.push(newBlog);
  writeBlogs(blogs);
  res.status(201).json(newBlog);
};

export const getAllBlogs = (_req: Request, res: Response) => {
  res.json(readBlogs());
};

export const updateBlog = (req: Request, res: Response) => {
  const blogs = readBlogs();
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Blog not found' });

  blogs[index] = {
    ...blogs[index],
    title: req.body.title,
    name: req.body.name,
    content: req.body.content,
    updated: new Date().toISOString(),
  };

  writeBlogs(blogs);
  res.json(blogs[index]);
};

export const deleteBlog = (req: Request, res: Response) => {
  const blogs = readBlogs();
  const filtered = blogs.filter((b) => b.id !== req.params.id);
  if (filtered.length === blogs.length) return res.status(404).json({ error: 'Blog not found' });

  writeBlogs(filtered);
  res.json({ message: 'Blog deleted successfully' });
};
