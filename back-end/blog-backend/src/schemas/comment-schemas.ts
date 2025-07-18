import Joi from 'joi';

export const AddCommentSchema = Joi.object({
  content: Joi.string().required(),
});
