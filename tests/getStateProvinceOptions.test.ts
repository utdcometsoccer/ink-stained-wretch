import { describe, it, expect } from 'vitest';
import { getStateProvinceOptions } from '../src/services/getStateProvinceOptions';

describe('getStateProvinceOptions', () => {
  it('should return array for valid country', () => {
    const options = getStateProvinceOptions('US');
    expect(Array.isArray(options)).toBe(true);
  });
});
