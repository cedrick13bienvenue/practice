import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getABlog,
  updateBlog,
  deleteBlog,
  hardDeleteBlog
} from '../controllers/blog-controller';

import { ValidationMiddleware } from '../middlewares/validate-blog';
import {
  AddBlogSchema,
  IdValidationSchema,
  UpdateBlogSchema,
  IdInBodySchema
} from '../schemas/blog-schema';

import { protect } from '../middlewares/protect';
import { roleChecker } from '../middlewares/role-checker';

import { upload } from '../utils/upload'; 

export const blogRouter = Router();

blogRouter.get('/blogs', getAllBlogs);

blogRouter.get(
  '/blogs/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  getABlog
);

blogRouter.post(
  '/blogs',
  protect,
  roleChecker(['admin']),
  upload.single('image'), 
  ValidationMiddleware({ type: 'body', schema: AddBlogSchema }),
  createBlog
);

blogRouter.put(
  '/blogs/:id',
  protect,
  roleChecker(['admin']),
  upload.single('image'), 
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: UpdateBlogSchema }),
  updateBlog
);

blogRouter.delete(
  '/blogs/:id',
  protect,
  roleChecker(['admin']),
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  deleteBlog
);

blogRouter.delete(
  '/blogs',
  protect,
  roleChecker(['admin']),
  ValidationMiddleware({ type: 'body', schema: IdInBodySchema }),
  hardDeleteBlog
);
