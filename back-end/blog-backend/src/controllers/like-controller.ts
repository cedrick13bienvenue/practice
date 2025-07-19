import { Request, Response } from 'express';
import { LikeModel } from '../models/like-model';
import { blogModel } from '../models/blog-model';
import { ResponseService } from '../utils/response';
import { IRequestUser } from '../middlewares/protect';

export const toggleLike = async (req: IRequestUser, res: Response) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?._id;

    // Check if blog exists
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return ResponseService({
        res,
        status: 404,
        success: false,
        message: 'Blog not found',
      });
    }

    // Check if user already liked this blog
    const existingLike = await LikeModel.findOne({ blog: blogId, user: userId });

    if (existingLike) {
      // Unlike: remove the like
      await LikeModel.findByIdAndDelete(existingLike._id);
      return ResponseService({
        res,
        message: 'Blog unliked successfully',
        data: { liked: false },
      });
    } else {
      // Like: create new like
      const newLike = new LikeModel({
        blog: blogId,
        user: userId,
      });
      await newLike.save();
      return ResponseService({
        res,
        message: 'Blog liked successfully',
        data: { liked: true },
      });
    }
  } catch (error) {
    ResponseService({
      res,
      status: 500,
      success: false,
      message: (error as Error).message,
    });
  }
};

export const getBlogLikes = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    // Get likes count and list of users who liked
    const likes = await LikeModel.find({ blog: blogId }).populate('user', 'name email');
    
    ResponseService({
      res,
      message: 'Blog likes fetched successfully',
      data: {
        count: likes.length,
        likes: likes,
      },
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