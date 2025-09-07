import { describe, it, expect, vi } from 'vitest';
import { getAccessToken } from '../src/services/getAccessToken';

vi.mock('../src/services/msalConfig', () => {
  return {
    msalInstance: {
      getAllAccounts: vi.fn(() => [{ username: 'testuser' }]),
      acquireTokenSilent: vi.fn(async () => ({ accessToken: 'mocked-token' }))
    }
  };
});

describe('getAccessToken', () => {
  it('returns a token string when account exists', async () => {
    const token = await getAccessToken();
    expect(token).toBe('mocked-token');
  });

  it('returns null when no accounts', async () => {
    const { msalInstance } = await import('../src/services/msalConfig');
    (msalInstance.getAllAccounts as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce([]);
    const token = await getAccessToken();
    expect(token).toBeNull();
  });

  it('returns null when acquireTokenSilent throws', async () => {
    const { msalInstance } = await import('../src/services/msalConfig');
    (msalInstance.getAllAccounts as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce([{ username: 'testuser' }]);
    (msalInstance.acquireTokenSilent as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(async () => { throw new Error('fail'); });
    const token = await getAccessToken();
    expect(token).toBeNull();
  });
});
