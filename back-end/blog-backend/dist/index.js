"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const app = (0, express_1.default)();
const PORT = 5500;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// JSON file to store blogs
const BLOG_FILE = 'blogData.json';
if (!fs_1.default.existsSync(BLOG_FILE))
    fs_1.default.writeFileSync(BLOG_FILE, '[]');
// Zod schema for validation
const blogSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    name: zod_1.z.string().min(3),
    content: zod_1.z.string().min(10),
});
// Helper functions to read/write JSON file
const readBlogs = () => {
    const data = fs_1.default.readFileSync(BLOG_FILE, 'utf-8');
    return JSON.parse(data);
};
const writeBlogs = (blogs) => {
    fs_1.default.writeFileSync(BLOG_FILE, JSON.stringify(blogs, null, 2));
};
// CREATE - Add a new blog
app.post('/blogs', (req, res) => {
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
app.get('/blogs', (_req, res) => {
    const blogs = readBlogs();
    res.json(blogs);
});
// UPDATE - Update an existing blog
app.put('/blogs/:id', (req, res) => {
    const result = blogSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues });
    }
    const blogs = readBlogs();
    const index = blogs.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    blogs[index] = Object.assign(Object.assign({}, blogs[index]), { title: req.body.title, name: req.body.name, content: req.body.content, updated: new Date().toISOString() });
    writeBlogs(blogs);
    res.json(blogs[index]);
});
// DELETE - Remove a blog
app.delete('/blogs/:id', (req, res) => {
    const blogs = readBlogs();
    const filtered = blogs.filter((b) => b.id !== req.params.id);
    if (filtered.length === blogs.length) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    writeBlogs(filtered);
    res.json({ message: 'Blog deleted successfully' });
});
app.get('/', (_req, res) => {
    res.send('📝 Welcome to Cedrick\'s Blog Backend API!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
