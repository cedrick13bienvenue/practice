import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getABlog,
  updateBlog,
  deleteBlog,
  hardDeleteBlog
} from '../controllers/blog-controller';

import { ensureAuthenticated } from '../middlewares/auth';
import { roleChecker } from '../middlewares/role-checker';

import { upload } from '../utils/upload'; 

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     responses:
 *       200:
 *         description: List of blogs
 *   post:
 *     summary: Create a new blog (admin only)
 *     responses:
 *       201:
 *         description: Blog created
 *
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog found
 *   put:
 *     summary: Update a blog (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog updated
 *   delete:
 *     summary: Soft delete a blog (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog soft-deleted
 *
 * /blogs/hard-delete:
 *   delete:
 *     summary: Hard delete a blog (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog permanently deleted
 */
export const blogRouter = Router();

blogRouter.get('/blogs', getAllBlogs);

blogRouter.get(
  '/blogs/:id',
  getABlog
);

blogRouter.post(
  '/blogs',
  ensureAuthenticated,
  roleChecker(['admin']),
  upload.single('image'), 
  createBlog
);

blogRouter.put(
  '/blogs/:id',
  ensureAuthenticated,
  roleChecker(['admin']),
  upload.single('image'), 
  updateBlog
);

blogRouter.delete(
  '/blogs/:id',
  ensureAuthenticated,
  roleChecker(['admin']),
  deleteBlog
);

blogRouter.delete(
  '/blogs/hard-delete',
  ensureAuthenticated,
  roleChecker(['admin']),
  hardDeleteBlog
);
