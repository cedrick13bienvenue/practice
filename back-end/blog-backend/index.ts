import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors'
import { z } from 'zod';

const app = express();
const PORT = 5500;
app.use(cors());
app.use(express.json());

const BLOG_FILE = 'blogData.json';
if (!fs.existsSync(BLOG_FILE)) fs.writeFileSync(BLOG_FILE, '[]');

// Zod validation schema
const blogSchema = z.object({
  title: z.string().min(3),
  name: z.string().min(3),
  content: z.string().min(10),
});

// Helpers
const readBlogs = () => JSON.parse(fs.readFileSync(BLOG_FILE, 'utf-8'));
const writeBlogs = (blogs: any[]) => fs.writeFileSync(BLOG_FILE, JSON.stringify(blogs, null, 2));

// CREATE a blog
app.post('/blogs', (req: Request, res: Response) => {
  const result = blogSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors });

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
});

// READ all blogs
app.get('/blogs', (_req, res) => {
  res.json(readBlogs());
});

// UPDATE a blog
app.put('/blogs/:id', (req: Request, res: Response) => {
  const result = blogSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.errors });

  const blogs = readBlogs();
  const index = blogs.findIndex((b: any) => b.id === req.params.id);
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
});

// DELETE a blog
app.delete('/blogs/:id', (req, res) => {
  const blogs = readBlogs();
  const newBlogs = blogs.filter((b: any) => b.id !== req.params.id);
  if (blogs.length === newBlogs.length) return res.status(404).json({ error: 'Blog not found' });

  writeBlogs(newBlogs);
  res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
