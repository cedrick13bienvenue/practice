import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(3),
  name: z.string().min(3),
  content: z.string().min(10),
});

export const validateBlog = (req: Request, res: Response, next: NextFunction) => {
  const result = blogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }
  next();
};
