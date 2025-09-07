import { describe, it, expect } from 'vitest';
import { msalConfig } from '../src/services/msalConfig';

describe('msalConfig', () => {
  it('should have clientId and authority', () => {
    expect(msalConfig).toHaveProperty('auth');
    expect(msalConfig.auth).toHaveProperty('clientId');
    expect(msalConfig.auth).toHaveProperty('authority');
  });
});
