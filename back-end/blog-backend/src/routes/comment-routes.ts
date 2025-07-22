import { Router } from 'express';
import { createComment, getCommentsForBlog } from '../controllers/comment-controller';
import { protect } from '../middlewares/protect';
import { roleChecker } from '../middlewares/role-checker';
import { ValidationMiddleware } from '../middlewares/validate-blog';

export const commentRouter = Router();

commentRouter.post(
  '/blogs/:blogId/comments',
  protect,
  roleChecker(['user']),
  createComment
);

commentRouter.get('/blogs/:blogId/comments', getCommentsForBlog);