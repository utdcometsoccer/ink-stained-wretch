import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCountries } from '../src/services/fetchCountries';
import { CountryResponse } from '../src/types/CountryResponse';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('fetchCountries', () => {
  const mockCountriesResponse: CountryResponse = {
    language: 'en',
    count: 2,
    countries: [
      {
        name: 'United States',
        code: 'US'
      },
      {
        name: 'Canada',
        code: 'CA'
      }
    ]
  };

  beforeEach(() => {
    // Mock import.meta.env for browser environment
    vi.stubGlobal('import.meta', {
      env: {
        VITE_COUNTRIES_API_URL: 'http://localhost:7001/api/countries'
      }
    });
  });

  it('returns countries on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockCountriesResponse)
    } as any);

    const result = await fetchCountries();
    expect(result).toEqual(mockCountriesResponse);
  });

  it('includes culture as route parameter when provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockCountriesResponse)
    } as any);

    await fetchCountries('en-US');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/countries/en-US',
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
      json: vi.fn().mockResolvedValueOnce(mockCountriesResponse)
    } as any);

    await fetchCountries(undefined, 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/countries',
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
      json: vi.fn().mockResolvedValueOnce(mockCountriesResponse)
    } as any);

    await fetchCountries('es-MX', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/countries/es-MX',
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

    await expect(fetchCountries()).rejects.toThrow(
      'Error fetching countries: Cannot read properties of undefined (reading \'status\')'
    );
  });

  it('throws error when API response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn()
    } as any);

    await expect(fetchCountries()).rejects.toThrow(
      'Failed to fetch countries: 500 Internal Server Error'
    );
  });

  it('throws error when network request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchCountries()).rejects.toThrow(
      'Error fetching countries: Network error'
    );
  });

  it('throws generic error when unknown error occurs', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('Unknown error');

    await expect(fetchCountries()).rejects.toThrow(
      'An unknown error occurred while fetching countries'
    );
  });
});
