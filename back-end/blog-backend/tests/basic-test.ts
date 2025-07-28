import { describe, it, expect } from '@jest/globals';
import { request, prefix } from './setup';

describe('Basic API Tests', () => {
  it('should return API welcome message', async () => {
    const res = await request.get('/');
    
    expect(res.status).toBe(200);
    expect(res.text).toContain('📝 Blog API Test');
  });

  it('should have working API prefix', async () => {
    const res = await request.get(`${prefix}blogs`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success');
  });
}); 