import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getABlog,
  updateBlog,
  deleteBlog,
  hardDeleteBlog
} from '../controllers/blog-controller';

import { protect } from '../middlewares/protect';
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
  protect,
  roleChecker(['admin']),
  upload.single('image'), 
  createBlog
);

blogRouter.put(
  '/blogs/:id',
  protect,
  roleChecker(['admin']),
  upload.single('image'), 
  updateBlog
);

blogRouter.delete(
  '/blogs/:id',
  protect,
  roleChecker(['admin']),
  deleteBlog
);

blogRouter.delete(
  '/blogs',
  protect,
  roleChecker(['admin']),
  hardDeleteBlog
);
