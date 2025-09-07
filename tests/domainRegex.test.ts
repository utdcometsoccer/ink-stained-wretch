import { describe, it, expect } from 'vitest';
import { domainRegex } from '../src/services/domainRegex';

describe('domainRegex', () => {
  it('should match valid domains', () => {
    expect(domainRegex.test('example.com')).toBe(true);
    expect(domainRegex.test('example.co.uk')).toBe(true);
  });
  it('should not match invalid domains', () => {
    expect(domainRegex.test('invalid_domain')).toBe(false);
    expect(domainRegex.test('example')).toBe(false);
  });
});
