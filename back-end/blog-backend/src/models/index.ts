import { getSequelize } from '../config/db';
import { UserModel, associateModels as associateUser } from './user-model';
import { BlogModel, associateModels as associateBlog } from './blog-model';
import { CommentModel, associateModels as associateComment } from './comment-model';
import { LikeModel, associateModels as associateLike } from './like-model';

const models = { UserModel, BlogModel, CommentModel, LikeModel };

// Set up associations
associateUser(models);
associateBlog(models);
associateComment(models);
associateLike(models);

// Sync models with the database
export const syncModels = async () => {
  const sequelize = getSequelize();
  await sequelize.sync({ alter: true }); // Use alter for dev, switch to false for prod
};

export { UserModel, BlogModel, CommentModel, LikeModel }; 