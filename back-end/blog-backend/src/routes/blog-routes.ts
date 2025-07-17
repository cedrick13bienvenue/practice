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

blogRouter.put(
  '/blogs/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  ValidationMiddleware({ type: 'body', schema: UpdateBlogSchema }),
  updateBlog
);

blogRouter.delete(
  '/blogs/:id',
  ValidationMiddleware({ type: 'params', schema: IdValidationSchema }),
  deleteBlog
);

blogRouter.delete(
  '/blogs',
  ValidationMiddleware({ type: 'body', schema: IdInBodySchema }),
  hardDeleteBlog
);