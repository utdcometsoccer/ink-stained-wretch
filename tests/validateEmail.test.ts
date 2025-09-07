import { describe, it, expect } from 'vitest';
import { validateEmail } from '../src/services/validateEmail';

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  it('should invalidate incorrect email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
