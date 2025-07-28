import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { request, userResponse, prefix } from './setup';
import { BlogModel } from '../src/models/blog-model';
import { UserModel } from '../src/models/user-model';

describe('Blog Tests', () => {
  let adminToken: string;
  let userToken: string;
  let testBlogId: number;

  beforeEach(async () => {
    // Create admin user
    const adminRes = await request.post(`${prefix}auth/register`).send({
      name: 'Admin User',
      email: 'admin@blogtest.com',
      password: 'password123',
      gender: 'male',
      role: 'admin'
    });
    adminToken = adminRes.body.data.token;

    // Create regular user
    const userRes = await request.post(`${prefix}auth/register`).send({
      name: 'Regular User',
      email: 'user@blogtest.com',
      password: 'password123',
      gender: 'female',
      role: 'user'
    });
    userToken = userRes.body.data.token;
  });

  describe('Create Blog', () => {
    it('should create a blog successfully as admin', async () => {
      const blogData = {
        title: 'Test Blog Post',
        content: 'This is a test blog content with lots of text to test the TEXT field.',
        image: 'test-image.jpg'
      };

      const res = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('title', blogData.title)
        .field('content', blogData.content)
        .attach('image', Buffer.from('fake image'), 'test-image.jpg');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', blogData.title);
      expect(res.body.data).toHaveProperty('slug');
      expect(res.body.data.author).toBeDefined();

      testBlogId = res.body.data.id;
    });

    it('should fail to create blog without authentication', async () => {
      const blogData = {
        title: 'Unauthorized Blog',
        content: 'This should fail'
      };

      const res = await request.post(`${prefix}blogs`).send(blogData);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access token required');
    });

    it('should fail to create blog as regular user', async () => {
      const blogData = {
        title: 'User Blog',
        content: 'This should fail for regular user'
      };

      const res = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(blogData);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should fail to create blog with invalid data', async () => {
      const invalidData = {
        title: '', // empty title
        content: 'Valid content'
      };

      const res = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Get All Blogs', () => {
    beforeEach(async () => {
      // Create some test blogs
      await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'First Blog',
          content: 'First blog content'
        });

      await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Second Blog',
          content: 'Second blog content'
        });
    });

    it('should get all blogs successfully', async () => {
      const res = await request.get(`${prefix}blogs`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should handle database errors when getting blogs', async () => {
      jest.spyOn(BlogModel, 'findAll').mockRejectedValue(new Error('Database error'));

      const res = await request.get(`${prefix}blogs`);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Get Single Blog', () => {
    beforeEach(async () => {
      // Create a test blog
      const blogRes = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Single Blog Test',
          content: 'Content for single blog test'
        });
      testBlogId = blogRes.body.data.id;
    });

    it('should get a single blog by ID', async () => {
      const res = await request.get(`${prefix}blogs/${testBlogId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testBlogId);
      expect(res.body.data.title).toBe('Single Blog Test');
    });

    it('should return 404 for non-existent blog', async () => {
      const res = await request.get(`${prefix}blogs/99999`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Update Blog', () => {
    beforeEach(async () => {
      // Create a test blog
      const blogRes = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Original Title',
          content: 'Original content'
        });
      testBlogId = blogRes.body.data.id;
    });

    it('should update blog successfully as admin', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const res = await request.put(`${prefix}blogs/${testBlogId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.content).toBe(updateData.content);
    });

    it('should fail to update blog as regular user', async () => {
      const updateData = {
        title: 'Unauthorized Update',
        content: 'This should fail'
      };

      const res = await request.put(`${prefix}blogs/${testBlogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should fail to update non-existent blog', async () => {
      const updateData = {
        title: 'Non-existent Update',
        content: 'This should fail'
      };

      const res = await request.put(`${prefix}blogs/99999`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Delete Blog', () => {
    beforeEach(async () => {
      // Create a test blog
      const blogRes = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Blog to Delete',
          content: 'Content to be deleted'
        });
      testBlogId = blogRes.body.data.id;
    });

    it('should soft delete blog successfully as admin', async () => {
      const res = await request.delete(`${prefix}blogs/${testBlogId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });

    it('should fail to delete blog as regular user', async () => {
      const res = await request.delete(`${prefix}blogs/${testBlogId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should hard delete blog successfully as admin', async () => {
      const res = await request.delete(`${prefix}blogs/hard-delete`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: testBlogId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('permanently deleted');
    });
  });

  describe('Database Error Handling', () => {
    it('should handle database errors during blog creation', async () => {
      jest.spyOn(BlogModel, 'create').mockRejectedValue(new Error('Database error'));

      const blogData = {
        title: 'Error Blog',
        content: 'This should fail'
      };

      const res = await request.post(`${prefix}blogs`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(blogData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it('should handle database errors during blog update', async () => {
      jest.spyOn(BlogModel, 'update').mockRejectedValue(new Error('Database error'));

      const updateData = {
        title: 'Error Update',
        content: 'This should fail'
      };

      const res = await request.put(`${prefix}blogs/1`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
}); 