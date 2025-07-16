import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  getABlog,
} from '../controllers/blog-controller';
import { ValidationMiddleware } from '../middlewares/validate-blog';
import { AddBlogSchema, IdValidationSchema } from '../schemas/blog-schema';

export const blogRouter = Router();

blogRouter.get('/blogs', getAllBlogs);
blogRouter.get(
  '/blogs/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  getABlog
);
blogRouter.post(
  '/blogs',
  ValidationMiddleware({ type: 'body', schema: AddBlogSchema }),
  createBlog
);
