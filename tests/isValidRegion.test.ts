import { describe, it, expect } from 'vitest';
import { isValidRegion } from '../src/services/isValidRegion';

describe('isValidRegion', () => {
  it('should return true for valid region', () => {
    expect(isValidRegion('US')).toBe(true);
  });
  it('should return false for invalid region', () => {
    expect(isValidRegion('XX')).toBe(false);
  });
});
