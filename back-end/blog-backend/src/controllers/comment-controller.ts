import { Request, Response } from 'express';
import { CommentModel } from '../models/comment-model';
import { blogModel } from '../models/blog-model';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/protect';

export const createComment = async (req: IRequestUser, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?._id; // from auth middleware
    const { content } = req.body;

    // Check blog exists
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Blog not found',
      });
    }

    // Create comment
    const comment = new CommentModel({
      blog: blogId,
      user: userId,
      content,
    });

    await comment.save();

    ResponseService({
      res,
      status: 201,
      message: 'Comment added successfully',
      data: comment,
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

export const getCommentsForBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    // Find comments for blog with user info (populate)
    const comments = await CommentModel.find({ blog: blogId }).populate('user', 'name email');

    ResponseService({
      res,
      status: 200,
      message: 'Comments fetched successfully',
      data: comments,
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
