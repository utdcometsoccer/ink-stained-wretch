import { describe, it, expect } from 'vitest';
import { validatePhone } from '../src/services/validatePhone';

describe('validatePhone', () => {
  it('should validate correct phone number', () => {
    expect(validatePhone('+1234567890')).toBe(true);
  });
  it('should invalidate incorrect phone number', () => {
    expect(validatePhone('12345')).toBe(false);
  });
});
