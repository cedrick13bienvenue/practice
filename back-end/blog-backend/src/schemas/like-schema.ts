import Joi from 'joi';

export const BlogIdSchema = Joi.object({
  blogId: Joi.string().length(24).required(),
});