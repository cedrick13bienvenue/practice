import { Router } from 'express';
import { toggleLike, getBlogLikes } from '../controllers/like-controller';
import { protect } from '../middlewares/protect';
import { roleChecker } from '../middlewares/role-checker';
import { ValidationMiddleware } from '../middlewares/validate-blog';
import { BlogIdSchema } from '../schemas/like-schema';

export const likeRouter = Router();

likeRouter.post(
  '/blogs/:blogId/like',
  protect,
  roleChecker(['user']),
  ValidationMiddleware({ type: 'params', schema: BlogIdSchema }),
  toggleLike
);

likeRouter.get(
  '/blogs/:blogId/likes',
  ValidationMiddleware({ type: 'params', schema: BlogIdSchema }),
  getBlogLikes
);