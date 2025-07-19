import { Request, Response } from 'express';
import { blogModel } from '../models/blog-model';
import { LikeModel } from '../models/like-model';
import { CommentModel } from '../models/comment-model';
import { generateSlug } from '../utils/helper';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/protect';

export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await blogModel.find();
    
    // Get likes and comments count for each blog
    const blogsWithCounts = await Promise.all(
      blogs.map(async (blog) => {
        const likesCount = await LikeModel.countDocuments({ blog: blog._id });
        const commentsCount = await CommentModel.countDocuments({ blog: blog._id });
        
        return {
          ...blog.toObject(),
          likesCount,
          commentsCount,
        };
      })
    );
    
    ResponseService({ res, data: blogsWithCounts });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getABlog = async (req: Request, res: Response) => {
  try {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Blog not found',
      });
    }
    
    // Get likes and comments count
    const likesCount = await LikeModel.countDocuments({ blog: blog._id });
    const commentsCount = await CommentModel.countDocuments({ blog: blog._id });
    
    const blogWithCounts = {
      ...blog.toObject(),
      likesCount,
      commentsCount,
    };
    
    ResponseService({ res, data: blogWithCounts });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const createBlog = async (req: IRequestUser, res: Response) => {
  try {
    const { title, description, author, content, isPublished } = req.body;
    const blog = new blogModel({
      title,
      slug: generateSlug(title),
      description,
      author,
      content,
      isPublished,
      createdAt: new Date(),
    });
    await blog.save();
    ResponseService({
      res,
      data: blog,
      message: 'Blog created successfully',
      status: 201,
    });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const updateData: any = { ...req.body, updatedAt: new Date() };

    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }

    const blog = await blogModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Blog not found',
      });
    }

    ResponseService({
      res,
      data: blog,
      message: 'Blog updated successfully',
    });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await blogModel.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );

    if (!blog) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Blog not found',
      });
    }

    ResponseService({
      res,
      data: blog,
      message: 'Blog soft-deleted successfully',
    });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const hardDeleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return ResponseService({
        res,
        status: 400,
        success: false,
        message: 'Blog id is required in request body',
      });
    }

    const deleted = await blogModel.findByIdAndDelete(id);

    if (!deleted) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Blog not found',
      });
    }

    ResponseService({
      res,
      message: 'Blog permanently deleted successfully',
    });
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};