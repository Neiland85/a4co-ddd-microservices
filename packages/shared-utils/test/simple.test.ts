// Simple test file to verify basic functionality
describe('Simple Shared Utils Test', () => {
  test('should work with basic Jest setup', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle environment variables', () => {
    process.env['NODE_ENV'] = 'test';
    expect(process.env['NODE_ENV']).toBe('test');
  });
});
