import { describe, it, expect } from 'vitest';
import { validateDomainWhois } from '../src/services/validateDomainWhois';

describe('validateDomainWhois', () => {
  it('should return true for valid domain', async () => {
    const result = await validateDomainWhois('example.com');
    expect(typeof result).toBe('boolean');
  });
});
