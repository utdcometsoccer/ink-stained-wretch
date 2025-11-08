
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
    } as unknown as Response);
    const requestBody = { active: true };
    const result = await fetchSubscriptionPlans(requestBody);
    expect(result).toEqual(mockPlans);
  });

  it('throws error if status is not 200', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 500,
      statusText: 'Server Error',
      json: vi.fn()
    } as unknown as Response);
    const requestBody = { active: true };
    await expect(fetchSubscriptionPlans(requestBody)).rejects.toThrow('Failed to fetch valid subscription plans: 500 Server Error');
  });

  it('returns data even if not array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce({})
    } as unknown as Response);
    const requestBody = { active: true };
    const result = await fetchSubscriptionPlans(requestBody);
    expect(result).toEqual({});
  });

  it('returns empty array when response is empty', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce([])
    } as unknown as Response);
    const requestBody = { active: true };
    const result = await fetchSubscriptionPlans(requestBody);
    expect(result).toEqual([]);
  });

  it('includes culture in request body when provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce([])
    } as unknown as Response);
    
    const requestBody = { active: true, culture: 'en-US' };
    await fetchSubscriptionPlans(requestBody);
    
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"culture":"en-US"')
      })
    );
  });

  it('excludes culture from request body when not provided', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce([])
    } as unknown as Response);
    
    const requestBody = { active: true };
    await fetchSubscriptionPlans(requestBody);
    
    const call = fetchSpy.mock.calls[0];
    const requestOptions = call[1] as RequestInit;
    const body = JSON.parse(requestOptions.body as string);
    expect(body.culture).toBeUndefined();
  });
});
