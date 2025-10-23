import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { CultureInfo } from '@idahoedokpayi/react-country-state-selector';
import { getCountryInformation, getCountryInformationWithAuth, useGetCountryInformation, clearCountryCache } from '../src/services/getCountryInformation';
import { fetchCountries } from '../src/services/fetchCountries';

// Mock the fetchCountries service
vi.mock('../src/services/fetchCountries', () => ({
  fetchCountries: vi.fn()
}));

const mockFetchCountries = vi.mocked(fetchCountries);

describe('getCountryInformation', () => {
  const mockCountriesResponse = {
    data: [
      {
        culture: 'en-US',
        countries: [
          {
            code: 'US' as const,
            name: 'United States',
            culture: 'en-US'
          },
          {
            code: 'CA' as const,
            name: 'Canada',
            culture: 'en-US'
          }
        ]
      }
    ]
  };

  const expectedCountryInfo = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    clearCountryCache();
  });

  afterEach(() => {
    clearCountryCache();
  });

  describe('getCountryInformationWithAuth function', () => {
    it('should fetch and transform country data correctly with auth token', async () => {
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getCountryInformationWithAuth(cultureInfo, 'test-token');

      expect(mockFetchCountries).toHaveBeenCalledWith('en-US', 'test-token');
      expect(result).toEqual(expectedCountryInfo);
    });

    it('should cache results separately for authenticated and non-authenticated requests', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);
      
      const mockAuthenticatedResponse = {
        data: [
          {
            culture: 'en-US',
            countries: [
              {
                code: 'US' as const,
                name: 'Authenticated United States',
                culture: 'en-US'
              }
            ]
          }
        ]
      };
      mockFetchCountries.mockResolvedValueOnce(mockAuthenticatedResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // Call without token (cached as 'en-US')
      const result1 = await getCountryInformationWithAuth(cultureInfo);
      
      // Call with token (cached as 'en-US-auth')
      const result2 = await getCountryInformationWithAuth(cultureInfo, 'test-token');

      expect(mockFetchCountries).toHaveBeenCalledTimes(2);
      expect(mockFetchCountries).toHaveBeenNthCalledWith(1, 'en-US', undefined);
      expect(mockFetchCountries).toHaveBeenNthCalledWith(2, 'en-US', 'test-token');
      expect(result1).toEqual(expectedCountryInfo);
      expect(result2).toEqual([{ code: 'US', name: 'Authenticated United States' }]);
    });
  });

  describe('getCountryInformation function', () => {
    it('should fetch and transform country data correctly', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getCountryInformation(cultureInfo);

      expect(mockFetchCountries).toHaveBeenCalledWith('en-US', undefined);
      expect(result).toEqual(expectedCountryInfo);
    });

    it('should cache results for the same culture', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // First call should fetch from API
      const result1 = await getCountryInformation(cultureInfo);
      
      // Second call should use cache
      const result2 = await getCountryInformation(cultureInfo);

      expect(mockFetchCountries).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(expectedCountryInfo);
      expect(result2).toEqual(expectedCountryInfo);
      expect(result1).toBe(result2); // Should be the same reference from cache
    });

    it('should handle different cultures separately', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);
      
      const mockSpanishResponse = {
        data: [
          {
            culture: 'es-MX',
            countries: [
              {
                code: 'MX' as const,
                name: 'México',
                culture: 'es-MX'
              }
            ]
          }
        ]
      };
      mockFetchCountries.mockResolvedValueOnce(mockSpanishResponse);

      const cultureInfoUS = new CultureInfo('en-US');
      const cultureInfoMX = new CultureInfo('es-MX');
      
      const resultUS = await getCountryInformation(cultureInfoUS);
      const resultMX = await getCountryInformation(cultureInfoMX);

      expect(mockFetchCountries).toHaveBeenCalledTimes(2);
      expect(mockFetchCountries).toHaveBeenNthCalledWith(1, 'en-US', undefined);
      expect(mockFetchCountries).toHaveBeenNthCalledWith(2, 'es-MX', undefined);
      expect(resultUS).toEqual(expectedCountryInfo);
      expect(resultMX).toEqual([{ code: 'MX', name: 'México' }]);
    });

    it('should return empty array on error', async () => {
      
      mockFetchCountries.mockRejectedValueOnce(new Error('API Error'));

      const cultureInfo = new CultureInfo('en-US');
      const result = await getCountryInformation(cultureInfo);

      expect(result).toEqual([]);
    });

    it('should clear cache when clearCountryCache is called', async () => {
      
      mockFetchCountries.mockResolvedValue(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // First call
      await getCountryInformation(cultureInfo);
      expect(mockFetchCountries).toHaveBeenCalledTimes(1);
      
      // Clear cache
      clearCountryCache();
      
      // Second call should fetch again
      await getCountryInformation(cultureInfo);
      expect(mockFetchCountries).toHaveBeenCalledTimes(2);
    });
  });

  describe('useGetCountryInformation hook', () => {
    it('should return a stable function reference without token', () => {
      const { result, rerender } = renderHook(() => useGetCountryInformation());
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should return a stable function reference with token', () => {
      const { result, rerender } = renderHook(() => useGetCountryInformation('test-token'));
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should work with the returned function without token', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const { result } = renderHook(() => useGetCountryInformation());
      
      const cultureInfo = new CultureInfo('en-US');
      const countryInfo = await result.current(cultureInfo);
      
      expect(countryInfo).toEqual(expectedCountryInfo);
      expect(mockFetchCountries).toHaveBeenCalledWith('en-US', undefined);
    });

    it('should work with the returned function with token', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const { result } = renderHook(() => useGetCountryInformation('test-token'));
      
      const cultureInfo = new CultureInfo('en-US');
      const countryInfo = await result.current(cultureInfo);
      
      expect(countryInfo).toEqual(expectedCountryInfo);
      expect(mockFetchCountries).toHaveBeenCalledWith('en-US', 'test-token');
    });

    it('should update when token changes', () => {
      const { result, rerender } = renderHook(
        ({ token }: { token?: string }) => useGetCountryInformation(token),
        { initialProps: { token: undefined as string | undefined } }
      );
      
      const firstFunction = result.current;
      
      rerender({ token: 'new-token' as string | undefined });
      
      const secondFunction = result.current;
      
      expect(firstFunction).not.toBe(secondFunction);
    });
  });
});
