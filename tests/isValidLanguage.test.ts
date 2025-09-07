import { describe, it, expect } from 'vitest';
import { isValidLanguage } from '../src/services/isValidLanguage';

describe('isValidLanguage', () => {
  it('should return true for valid language', () => {
    expect(isValidLanguage('en')).toBe(true);
  });
  it('should return false for invalid language', () => {
    expect(isValidLanguage('xx')).toBe(false);
  });
});
