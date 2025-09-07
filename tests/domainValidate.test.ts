import { describe, it, expect } from 'vitest';
import { domainValidate } from '../src/services/domainValidate';

describe('domainValidate', () => {
  it('should validate correct domains', () => {
    expect(domainValidate('example.com')).toBe(true);
  });
  it('should invalidate incorrect domains', () => {
    expect(domainValidate('invalid_domain')).toBe(false);
  });
});
