import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} from '../controllers/blog-controller';
import { validateBlog } from '../middleware/validate-blog';

const router = Router();

router.get('/', (_req, res) => {
  res.send('📝 Blog Backend API!');
});

router.get('/blogs', getAllBlogs);
router.post('/blogs', validateBlog, createBlog);
router.put('/blogs/:id', validateBlog, updateBlog);
router.delete('/blogs/:id', deleteBlog);

export default router;
