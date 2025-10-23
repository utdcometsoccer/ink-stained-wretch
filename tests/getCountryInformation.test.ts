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
    language: 'en',
    count: 2,
    countries: [
      {
        code: 'US' as const,
        name: 'United States'
      },
      {
        code: 'CA' as const,
        name: 'Canada'
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
    it('should fetch and transform country data correctly', async () => {
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getCountryInformationWithAuth(cultureInfo);

      expect(mockFetchCountries).toHaveBeenCalledWith('en-US');
      expect(result).toEqual(expectedCountryInfo);
    });

    it('should cache results correctly', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // Call first time (should fetch from API)
      const result1 = await getCountryInformationWithAuth(cultureInfo);
      
      // Call second time (should use cache)
      const result2 = await getCountryInformationWithAuth(cultureInfo);

      expect(mockFetchCountries).toHaveBeenCalledTimes(1);
      expect(mockFetchCountries).toHaveBeenCalledWith('en-US');
      expect(result1).toEqual(expectedCountryInfo);
      expect(result2).toEqual(expectedCountryInfo);
    });
  });

  describe('getCountryInformation function', () => {
    it('should fetch and transform country data correctly', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getCountryInformation(cultureInfo);

      expect(mockFetchCountries).toHaveBeenCalledWith('en-US');
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
        language: 'es',
        count: 1,
        countries: [
          {
            code: 'MX' as const,
            name: 'México'
          }
        ]
      };
      mockFetchCountries.mockResolvedValueOnce(mockSpanishResponse);

      const cultureInfoUS = new CultureInfo('en-US');
      const cultureInfoMX = new CultureInfo('es-MX');
      
      const resultUS = await getCountryInformation(cultureInfoUS);
      const resultMX = await getCountryInformation(cultureInfoMX);

      expect(mockFetchCountries).toHaveBeenCalledTimes(2);
      expect(mockFetchCountries).toHaveBeenNthCalledWith(1, 'en-US');
      expect(mockFetchCountries).toHaveBeenNthCalledWith(2, 'es-MX');
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

    it('should return a stable function reference', () => {
      const { result, rerender } = renderHook(() => useGetCountryInformation());
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should work with the returned function', async () => {
      
      mockFetchCountries.mockResolvedValueOnce(mockCountriesResponse);

      const { result } = renderHook(() => useGetCountryInformation());
      
      const cultureInfo = new CultureInfo('en-US');
      const countryInfo = await result.current(cultureInfo);
      
      expect(countryInfo).toEqual(expectedCountryInfo);
      expect(mockFetchCountries).toHaveBeenCalledWith('en-US');
    });
  });
});
