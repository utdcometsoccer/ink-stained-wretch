import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchStatesProvinces } from '../src/services/fetchStatesProvinces';
import { StateProvinceResponse } from '../src/types/StateProvinceResponse';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchStatesProvinces', () => {
  const mockStateProvincesResponse: StateProvinceResponse = {
    data: [
      {
        country: 'United States',
        culture: 'en-US',
        stateProvinces: [
          {
            name: 'California',
            code: 'CA',
            country: 'United States',
            culture: 'en-US'
          }
        ]
      },
      {
        country: 'Canada',
        culture: 'en-CA',
        stateProvinces: [
          {
            name: 'Ontario',
            code: 'ON',
            country: 'Canada',
            culture: 'en-CA'
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    // Mock import.meta.env for browser environment
    vi.stubGlobal('import.meta', {
      env: {
        VITE_STATES_PROVINCES_API_URL: 'http://localhost:7001/api/stateprovinces'
      }
    });
  });

  it('returns states and provinces on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockStateProvincesResponse)
    } as any);

    const result = await fetchStatesProvinces();
    expect(result).toEqual(mockStateProvincesResponse);
  });

  it('includes culture as route parameter when provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockStateProvincesResponse)
    } as any);

    await fetchStatesProvinces('en-US');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/stateprovinces/en-US',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  });



  it('includes authorization header when access token is provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockStateProvincesResponse)
    } as any);

    await fetchStatesProvinces(undefined, 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/stateprovinces',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    );
  });

  it('includes culture as route parameter and authorization header when both are provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockStateProvincesResponse)
    } as any);

    await fetchStatesProvinces('es-MX', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/stateprovinces/es-MX',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }
    );
  });

  it('throws error when fetch returns undefined', async () => {
    // Mock fetch to return undefined (simulating network failure)
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(undefined as any);

    await expect(fetchStatesProvinces()).rejects.toThrow(
      'Error fetching states/provinces: Cannot read properties of undefined (reading \'status\')'
    );
  });

  it('throws error when API response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn()
    } as any);

    await expect(fetchStatesProvinces()).rejects.toThrow(
      'Failed to fetch states/provinces: 500 Internal Server Error'
    );
  });

  it('throws error when network request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchStatesProvinces()).rejects.toThrow(
      'Error fetching states/provinces: Network error'
    );
  });

  it('throws generic error when unknown error occurs', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('Unknown error');

    await expect(fetchStatesProvinces()).rejects.toThrow(
      'An unknown error occurred while fetching states/provinces'
    );
  });
});