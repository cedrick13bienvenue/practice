import Joi from 'joi';

export const AddBlogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().min(20).required(),
  author: Joi.string().required(),
  content: Joi.string().required(),
  isPublished: Joi.boolean().required(),
});

export const IdValidationSchema = Joi.object({
  id: Joi.string().length(24).required(),
});
