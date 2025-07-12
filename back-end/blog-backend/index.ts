import express, { Request, Response } from 'express';
import fs from 'fs';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(express.json());

// JSON file to store blogs
const BLOG_FILE = 'blogData.json';
if (!fs.existsSync(BLOG_FILE)) fs.writeFileSync(BLOG_FILE, '[]');

// Zod schema for validation
const blogSchema = z.object({
  title: z.string().min(3),
  name: z.string().min(3),
  content: z.string().min(10),
});

// Helper functions to read/write JSON file
const readBlogs = (): any[] => {
  const data = fs.readFileSync(BLOG_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeBlogs = (blogs: any[]): void => {
  fs.writeFileSync(BLOG_FILE, JSON.stringify(blogs, null, 2));
};

// CREATE - Add a new blog
app.post('/blogs', (req: Request, res: Response) => {
  const result = blogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

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

// READ - Get all blogs
app.get('/blogs', (_req: Request, res: Response) => {
  const blogs = readBlogs();
  res.json(blogs);
});

// UPDATE - Update an existing blog
app.put('/blogs/:id', (req: Request, res: Response) => {
  const result = blogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const blogs = readBlogs();
  const index = blogs.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Blog not found' });
  }

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

// DELETE - Remove a blog
app.delete('/blogs/:id', (req: Request, res: Response) => {
  const blogs = readBlogs();
  const filtered = blogs.filter((b) => b.id !== req.params.id);
  if (filtered.length === blogs.length) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  writeBlogs(filtered);
  res.json({ message: 'Blog deleted successfully' });
});

app.get('/', (_req: Request, res: Response) => {
  res.send('📝 Blog Backend API!');
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at PORT:${PORT}`);
});
