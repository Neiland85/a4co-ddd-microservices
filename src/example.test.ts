import { sum } from './utils';

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});

describe('Utils - sum function', () => {
  it('should return the sum of two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(sum(0, 0)).toBe(0);
  });
});
