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
  '/blogs',
  ensureAuthenticated,
  roleChecker(['admin']),
  hardDeleteBlog
);
