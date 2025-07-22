import { Router } from 'express';
import { toggleLike, getBlogLikes } from '../controllers/like-controller';
import { protect } from '../middlewares/protect';
import { roleChecker } from '../middlewares/role-checker';
import { ValidationMiddleware } from '../middlewares/validate-blog';

export const likeRouter = Router();

likeRouter.post(
  '/blogs/:blogId/like',
  protect,
  roleChecker(['user']),
  toggleLike
);

likeRouter.get(
  '/blogs/:blogId/likes',
  getBlogLikes
);