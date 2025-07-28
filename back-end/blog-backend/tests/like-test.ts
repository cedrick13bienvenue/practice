import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { request, userResponse, prefix } from './setup';
import { LikeModel } from '../src/models/like-model';

describe('Like Tests', () => {
  let userToken: string;
  let adminToken: string;
  let testBlogId: number;

  beforeEach(async () => {
    // Create admin user
    const adminRes = await request.post(`${prefix}auth/register`).send({
      name: 'Admin User',
      email: 'admin@liketest.com',
      password: 'password123',
      gender: 'male',
      role: 'admin'
    });
    adminToken = adminRes.body.data.token;

    // Create regular user
    const userRes = await request.post(`${prefix}auth/register`).send({
      name: 'Regular User',
      email: 'user@liketest.com',
      password: 'password123',
      gender: 'female',
      role: 'user'
    });
    userToken = userRes.body.data.token;

    // Create a test blog
    const blogRes = await request.post(`${prefix}blogs`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Blog for Likes',
        content: 'This is a test blog for like testing'
      });
    testBlogId = blogRes.body.data.id;
  });

  describe('Toggle Like', () => {
    it('should like a blog successfully as user', async () => {
      const res = await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('liked');
    });

    it('should unlike a blog successfully as user', async () => {
      // First like the blog
      await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      // Then unlike it
      const res = await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('unliked');
    });

    it('should fail to like blog without authentication', async () => {
      const res = await request.post(`${prefix}blogs/${testBlogId}/like`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access token required');
    });

    it('should fail to like non-existent blog', async () => {
      const res = await request.post(`${prefix}blogs/99999/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should handle multiple likes from same user', async () => {
      // Like the blog
      const likeRes = await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(likeRes.status).toBe(200);
      expect(likeRes.body.message).toContain('liked');

      // Try to like again (should toggle to unlike)
      const toggleRes = await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(toggleRes.status).toBe(200);
      expect(toggleRes.body.message).toContain('unliked');
    });
  });

  describe('Get Blog Likes', () => {
    beforeEach(async () => {
      // Create some likes
      await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${adminToken}`);
    });

    it('should get all likes for a blog', async () => {
      const res = await request.get(`${prefix}blogs/${testBlogId}/likes`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('blogId', testBlogId);
      expect(res.body.data[0]).toHaveProperty('userId');
    });

    it('should return empty array for blog with no likes', async () => {
      // Create a new blog without likes
      const newBlogRes = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'No Likes Blog',
          content: 'Blog with no likes'
        });

      const res = await request.get(`${prefix}blogs/${newBlogRes.body.data.id}/likes`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it('should return 404 for non-existent blog likes', async () => {
      const res = await request.get(`${prefix}blogs/99999/likes`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Database Error Handling', () => {
    it('should handle database errors during like toggle', async () => {
      jest.spyOn(LikeModel, 'findOne').mockRejectedValue(new Error('Database error'));

      const res = await request.post(`${prefix}blogs/${testBlogId}/like`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should handle database errors when getting likes', async () => {
      jest.spyOn(LikeModel, 'findAll').mockRejectedValue(new Error('Database error'));

      const res = await request.get(`${prefix}blogs/${testBlogId}/likes`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
}); 