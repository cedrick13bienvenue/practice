import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
} from '../controllers/blog-controller';
import { validateAddBlog, validateId } from '../middlewares/validate-blog';

const router = express.Router();

router.post('/', validateAddBlog, createBlog);
router.get('/', getAllBlogs);
router.get('/:id', validateId, getBlogById);
router.delete('/:id', validateId, deleteBlog);

export default router;
