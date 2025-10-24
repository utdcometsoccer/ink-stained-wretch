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
      'http://localhost:7001/api/countries/en',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  });



  it('returns fallback data when fetch returns undefined', async () => {
    // Mock fetch to return undefined (simulating network failure)
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(undefined as any);

    const result = await fetchCountries();
    
    // Should return default English countries as fallback
    expect(result.language).toBe('en');
    expect(result.countries).toHaveLength(5);
    expect(result.countries[0].code).toBe('US');
    
    // Verify warning was logged
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('returns fallback data when API response is not ok', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: vi.fn()
    } as any);

    const result = await fetchCountries();
    
    // Should return default English countries as fallback
    expect(result.language).toBe('en');
    expect(result.countries).toHaveLength(5);
    
    // Verify warning was logged
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('returns fallback data when network request fails', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchCountries();

    expect(result).toEqual({
      language: "en",
      count: 5,
      countries: [
        { code: "US", name: "United States" },
        { code: "CA", name: "Canada" },
        { code: "GB", name: "United Kingdom" },
        { code: "AU", name: "Australia" },
        { code: "DE", name: "Germany" }
      ]
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch countries from remote service, using fallback data:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('returns fallback data when unknown error occurs', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('Unknown error');

    const result = await fetchCountries();
    
    // Should return default English countries as fallback
    expect(result.language).toBe('en');
    expect(result.countries).toHaveLength(5);
    
    // Verify warning was logged
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
