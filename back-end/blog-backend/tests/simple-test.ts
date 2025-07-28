import { describe, it, expect } from '@jest/globals';

describe('Simple Math Tests', () => {
  it('should add two numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should multiply numbers correctly', () => {
    expect(3 * 4).toBe(12);
  });
});

describe('String Tests', () => {
  it('should concatenate strings', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  it('should check string length', () => {
    expect('test'.length).toBe(4);
  });
}); 