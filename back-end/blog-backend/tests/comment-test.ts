import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { request, userResponse, prefix } from './setup';
import { CommentModel } from '../src/models/comment-model';
import { BlogModel } from '../src/models/blog-model';

describe('Comment Tests', () => {
  let userToken: string;
  let adminToken: string;
  let testBlogId: number;
  let testCommentId: number;

  beforeEach(async () => {
    // Create admin user
    const adminRes = await request.post(`${prefix}auth/register`).send({
      name: 'Admin User',
      email: 'admin@commenttest.com',
      password: 'password123',
      gender: 'male',
      role: 'admin'
    });
    adminToken = adminRes.body.data.token;

    // Create regular user
    const userRes = await request.post(`${prefix}auth/register`).send({
      name: 'Regular User',
      email: 'user@commenttest.com',
      password: 'password123',
      gender: 'female',
      role: 'user'
    });
    userToken = userRes.body.data.token;

    // Create a test blog
    const blogRes = await request.post(`${prefix}blogs`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Blog for Comments',
        content: 'This is a test blog for comment testing'
      });
    testBlogId = blogRes.body.data.id;
  });

  describe('Create Comment', () => {
    it('should create a comment successfully as user', async () => {
      const commentData = {
        content: 'This is a test comment'
      };

      const res = await request.post(`${prefix}blogs/${testBlogId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('content', commentData.content);
      expect(res.body.data).toHaveProperty('blogId', testBlogId);
      expect(res.body.data).toHaveProperty('authorId');

      testCommentId = res.body.data.id;
    });

    it('should fail to create comment without authentication', async () => {
      const commentData = {
        content: 'Unauthorized comment'
      };

      const res = await request.post(`${prefix}blogs/${testBlogId}/comments`)
        .send(commentData);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access token required');
    });

    it('should fail to create comment on non-existent blog', async () => {
      const commentData = {
        content: 'Comment on non-existent blog'
      };

      const res = await request.post(`${prefix}blogs/99999/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should fail to create comment with invalid data', async () => {
      const invalidData = {
        content: '' // empty content
      };

      const res = await request.post(`${prefix}blogs/${testBlogId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Get Comments for Blog', () => {
    beforeEach(async () => {
      // Create some test comments
      await request.post(`${prefix}blogs/${testBlogId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'First comment'
        });

      await request.post(`${prefix}blogs/${testBlogId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'Second comment'
        });
    });

    it('should get all comments for a blog', async () => {
      const res = await request.get(`${prefix}blogs/${testBlogId}/comments`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('content');
      expect(res.body.data[0]).toHaveProperty('blogId', testBlogId);
    });

    it('should return empty array for blog with no comments', async () => {
      // Create a new blog without comments
      const newBlogRes = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Empty Blog',
          content: 'Blog with no comments'
        });

      const res = await request.get(`${prefix}blogs/${newBlogRes.body.data.id}/comments`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it('should return 404 for non-existent blog comments', async () => {
      const res = await request.get(`${prefix}blogs/99999/comments`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Database Error Handling', () => {
    it('should handle database errors during comment creation', async () => {
      jest.spyOn(CommentModel, 'create').mockRejectedValue(new Error('Database error'));

      const commentData = {
        content: 'Error comment'
      };

      const res = await request.post(`${prefix}blogs/${testBlogId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should handle database errors when getting comments', async () => {
      jest.spyOn(CommentModel, 'findAll').mockRejectedValue(new Error('Database error'));

      const res = await request.get(`${prefix}blogs/${testBlogId}/comments`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
}); 