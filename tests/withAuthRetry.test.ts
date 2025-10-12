import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withAuthRetry } from '../src/services/withAuthRetry';
import { UnauthorizedError } from '../src/types/UnauthorizedError';

// Mock getAccessToken to avoid MSAL dependencies
vi.mock('../src/services/getAccessToken', () => ({
  getAccessToken: vi.fn()
}));

describe('withAuthRetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return result on first successful call', async () => {
    const serviceFn = vi.fn().mockResolvedValue({ data: 'success' });
    const result = await withAuthRetry(serviceFn, 'old-token');
    
    expect(serviceFn).toHaveBeenCalledTimes(1);
    expect(serviceFn).toHaveBeenCalledWith('old-token');
    expect(result).toEqual({ data: 'success' });
  });

  it('should retry with new token on UnauthorizedError', async () => {
    const { getAccessToken } = await import('../src/services/getAccessToken');
    const serviceFn = vi.fn()
      .mockRejectedValueOnce(new UnauthorizedError())
      .mockResolvedValueOnce({ data: 'success after retry' });
    
    vi.mocked(getAccessToken).mockResolvedValue('new-token');
    
    const updateToken = vi.fn();
    
    const result = await withAuthRetry(serviceFn, 'old-token', updateToken);
    
    expect(serviceFn).toHaveBeenCalledTimes(2);
    expect(serviceFn).toHaveBeenNthCalledWith(1, 'old-token');
    expect(serviceFn).toHaveBeenNthCalledWith(2, 'new-token');
    expect(getAccessToken).toHaveBeenCalledTimes(1);
    expect(updateToken).toHaveBeenCalledWith('new-token');
    expect(result).toEqual({ data: 'success after retry' });
  });

  it('should call updateToken callback with new token on retry', async () => {
    const { getAccessToken } = await import('../src/services/getAccessToken');
    const serviceFn = vi.fn()
      .mockRejectedValueOnce(new UnauthorizedError())
      .mockResolvedValueOnce({ data: 'success' });
    
    vi.mocked(getAccessToken).mockResolvedValue('refreshed-token');
    
    const updateToken = vi.fn();
    
    await withAuthRetry(serviceFn, 'expired-token', updateToken);
    
    expect(updateToken).toHaveBeenCalledWith('refreshed-token');
  });

  it('should not retry on non-401 errors', async () => {
    const serviceFn = vi.fn().mockRejectedValue(new Error('Network error'));
    
    await expect(withAuthRetry(serviceFn, 'token')).rejects.toThrow('Network error');
    expect(serviceFn).toHaveBeenCalledTimes(1);
  });

  it('should handle null token from getAccessToken', async () => {
    const { getAccessToken } = await import('../src/services/getAccessToken');
    const serviceFn = vi.fn()
      .mockRejectedValueOnce(new UnauthorizedError())
      .mockResolvedValueOnce({ data: 'success' });
    
    vi.mocked(getAccessToken).mockResolvedValue(null);
    
    const updateToken = vi.fn();
    
    await withAuthRetry(serviceFn, 'old-token', updateToken);
    
    expect(serviceFn).toHaveBeenNthCalledWith(2, undefined);
    expect(updateToken).toHaveBeenCalledWith(null);
  });

  it('should work without updateToken callback', async () => {
    const { getAccessToken } = await import('../src/services/getAccessToken');
    const serviceFn = vi.fn()
      .mockRejectedValueOnce(new UnauthorizedError())
      .mockResolvedValueOnce({ data: 'success' });
    
    vi.mocked(getAccessToken).mockResolvedValue('new-token');
    
    const result = await withAuthRetry(serviceFn, 'old-token');
    
    expect(result).toEqual({ data: 'success' });
  });
});
