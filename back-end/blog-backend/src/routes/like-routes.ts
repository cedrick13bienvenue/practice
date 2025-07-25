import { Router } from 'express';
import { toggleLike, getBlogLikes } from '../controllers/like-controller';
import { ensureAuthenticated } from '../middlewares/auth';
import { roleChecker } from '../middlewares/role-checker';
import { ValidationMiddleware } from '../middlewares/validate-blog';

export const likeRouter = Router();

/**
 * @swagger
 * /blogs/{blogId}/like:
 *   post:
 *     summary: Like or unlike a blog (user only)
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 *
 * /blogs/{blogId}/likes:
 *   get:
 *     summary: Get likes for a blog
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of likes
 */
likeRouter.post(
  '/blogs/:blogId/like',
  ensureAuthenticated,
  roleChecker(['user']),
  toggleLike
);

likeRouter.get(
  '/blogs/:blogId/likes',
  getBlogLikes
);