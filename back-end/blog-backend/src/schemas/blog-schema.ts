import joi from 'joi';

export const createBlogSchema = joi.object({
  title: joi.string().min(3).max(200).required(),
  description: joi.string().min(20).max(500).required(),
  content: joi.string().min(10).required(),
  author: joi.string().min(2).max(100).required(),
  isPublished: joi.boolean().required()
});

export const updateBlogSchema = joi.object({
  title: joi.string().min(3).max(200).optional(),
  description: joi.string().min(20).max(500).optional(),
  content: joi.string().min(10).optional(),
  author: joi.string().min(2).max(100).optional(),
  isPublished: joi.boolean().optional()
});

export const idSchema = joi.object({
  id: joi.string().hex().length(24).required()
});

export const querySchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  limit: joi.number().integer().min(1).max(100).default(10),
  search: joi.string().optional(),
  author: joi.string().optional(),
  isPublished: joi.boolean().optional()
});