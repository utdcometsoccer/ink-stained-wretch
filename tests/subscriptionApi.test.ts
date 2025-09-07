
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSubscriptionPlans } from '../src/services/subscriptionApi';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchSubscriptionPlans', () => {
  it('returns plans on success', async () => {
    const mockPlans = [
      { label: 'Plan A', price: 10, duration: 1, features: ['A'] },
      { label: 'Plan B', price: 20, duration: 2, features: ['B'] }
    ];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockPlans)
    } as any);
    const result = await fetchSubscriptionPlans();
    expect(result).toEqual(mockPlans);
  });

  it('throws error if status is not 200', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 500,
      statusText: 'Server Error',
      json: vi.fn()
    } as any);
    await expect(fetchSubscriptionPlans()).rejects.toThrow('Failed to fetch valid subscription plans: 500 Server Error');
  });

  it('throws error if data is not array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce({})
    } as any);
    await expect(fetchSubscriptionPlans()).rejects.toThrow('Failed to fetch valid subscription plans: 200 OK');
  });

  it('throws error if array is empty', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce([])
    } as any);
    await expect(fetchSubscriptionPlans()).rejects.toThrow('Failed to fetch valid subscription plans: 200 OK');
  });
});
