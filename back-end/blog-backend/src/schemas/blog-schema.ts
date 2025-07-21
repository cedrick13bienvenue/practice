import Joi from 'joi';

export const AddBlogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().min(20).required(),
  author: Joi.string().required(),
  content: Joi.string().required(),
  // Remove image validation - multer handles the file
  isPublished: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string().valid('true', 'false')
  ).required(),
});

export const UpdateBlogSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().min(20),
  author: Joi.string(),
  content: Joi.string(),
  // Remove image validation - multer handles the file
  isPublished: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string().valid('true', 'false')
  ),
});

// Keep your other schemas unchanged
export const IdValidationSchema = Joi.object({
  id: Joi.string().length(24).required(),
});

export const IdInBodySchema = Joi.object({
  id: Joi.string().length(24).required(),
});