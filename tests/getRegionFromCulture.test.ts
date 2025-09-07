import { describe, it, expect } from 'vitest';
import { getRegionFromCulture } from '../src/services/getRegionFromCulture';

describe('getRegionFromCulture', () => {
  it('should return region for valid culture', () => {
    expect(getRegionFromCulture('en-US')).toBe('US');
  });  
});
