import { Request, Response, NextFunction } from 'express';
import { AddBlogSchema, IdValidationSchema } from '../schemas/blogSchema';

export const validateAddBlog = (req: Request, res: Response, next: NextFunction) => {
  const { error } = AddBlogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        field: detail.context?.key,
        message: detail.message,
      })),
    });
  }
  next();
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { error } = IdValidationSchema.validate({ id: req.params.id });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => ({
        field: detail.context?.key,
        message: detail.message,
      })),
    });
  }
  next();
};
