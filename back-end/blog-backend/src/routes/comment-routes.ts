import { Router } from 'express';
import { createComment, getCommentsForBlog } from '../controllers/comment-controller';
import { ensureAuthenticated } from '../middlewares/auth';
import { roleChecker } from '../middlewares/role-checker';
import { ValidationMiddleware } from '../middlewares/validate-blog';

export const commentRouter = Router();

commentRouter.post(
  '/blogs/:blogId/comments',
  ensureAuthenticated,
  roleChecker(['user']),
  createComment
);

commentRouter.get('/blogs/:blogId/comments', getCommentsForBlog);