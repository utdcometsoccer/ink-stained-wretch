import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { CultureInfo } from '@idahoedokpayi/react-country-state-selector';
import { getStateProvinceInformation, getStateProvinceInformationWithAuth, useGetStateProvinceInformation, clearStateProvinceCache } from '../src/services/getStateProvinceInformation';
import { fetchStatesProvinces } from '../src/services/fetchStatesProvinces';

// Mock the fetchStatesProvinces service
vi.mock('../src/services/fetchStatesProvinces', () => ({
  fetchStatesProvinces: vi.fn()
}));

// Mock the library's default function
vi.mock('@idahoedokpayi/react-country-state-selector', async () => {
  const actual = await vi.importActual('@idahoedokpayi/react-country-state-selector');
  return {
    ...actual,
    getStateProvinceInformationByCulture: vi.fn()
  };
});

const mockFetchStatesProvinces = vi.mocked(fetchStatesProvinces);

// Import the mocked function
const { getStateProvinceInformationByCulture } = await import('@idahoedokpayi/react-country-state-selector');
const mockGetStateProvinceInformationByCulture = vi.mocked(getStateProvinceInformationByCulture);

describe('getStateProvinceInformation', () => {
  const mockStateProvincesResponse = {
    data: [
      {
        country: 'US',
        culture: 'en-US',
        stateProvinces: [
          {
            code: 'CA',
            name: 'California',
            country: 'US',
            culture: 'en-US'
          },
          {
            code: 'TX',
            name: 'Texas',
            country: 'US',
            culture: 'en-US'
          }
        ]
      }
    ]
  };

  const expectedStateProvinceInfo = [
    { code: 'CA', name: 'California' },
    { code: 'TX', name: 'Texas' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    clearStateProvinceCache();
  });

  afterEach(() => {
    clearStateProvinceCache();
  });

  describe('getStateProvinceInformationWithAuth function', () => {
    it('should fetch and transform state/province data correctly with auth token', async () => {
      mockFetchStatesProvinces.mockResolvedValueOnce(mockStateProvincesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getStateProvinceInformationWithAuth(cultureInfo);

      expect(mockFetchStatesProvinces).toHaveBeenCalledWith('en-US');
      expect(result).toEqual(expectedStateProvinceInfo);
    });


  });

  describe('getStateProvinceInformation function', () => {
    it('should fetch and transform state/province data correctly', async () => {
      
      mockFetchStatesProvinces.mockResolvedValueOnce(mockStateProvincesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getStateProvinceInformation(cultureInfo);

      expect(mockFetchStatesProvinces).toHaveBeenCalledWith('en-US');
      expect(result).toEqual(expectedStateProvinceInfo);
    });

    it('should cache results for the same culture', async () => {
      
      mockFetchStatesProvinces.mockResolvedValueOnce(mockStateProvincesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // First call should fetch from API
      const result1 = await getStateProvinceInformation(cultureInfo);
      
      // Second call should use cache
      const result2 = await getStateProvinceInformation(cultureInfo);

      expect(mockFetchStatesProvinces).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(expectedStateProvinceInfo);
      expect(result2).toEqual(expectedStateProvinceInfo);
      expect(result1).toBe(result2); // Should be the same reference from cache
    });

    it('should handle different cultures separately', async () => {
      
      mockFetchStatesProvinces.mockResolvedValueOnce(mockStateProvincesResponse);
      
      const mockCanadaResponse = {
        data: [
          {
            country: 'CA',
            culture: 'en-CA',
            stateProvinces: [
              {
                code: 'ON',
                name: 'Ontario',
                country: 'CA',
                culture: 'en-CA'
              }
            ]
          }
        ]
      };
      mockFetchStatesProvinces.mockResolvedValueOnce(mockCanadaResponse);

      const cultureInfoUS = new CultureInfo('en-US');
      const cultureInfoCA = new CultureInfo('en-CA');
      
      const resultUS = await getStateProvinceInformation(cultureInfoUS);
      const resultCA = await getStateProvinceInformation(cultureInfoCA);

      expect(mockFetchStatesProvinces).toHaveBeenCalledTimes(2);
      expect(mockFetchStatesProvinces).toHaveBeenNthCalledWith(1, 'en-US');
      expect(mockFetchStatesProvinces).toHaveBeenNthCalledWith(2, 'en-CA');
      expect(resultUS).toEqual(expectedStateProvinceInfo);
      expect(resultCA).toEqual([{ code: 'ON', name: 'Ontario' }]);
    });

    it('should fall back to library default function on API error', async () => {
      mockFetchStatesProvinces.mockRejectedValueOnce(new Error('API Error'));
      
      const fallbackStateProvinces = [
        { code: 'CA', name: 'California (fallback)' },
        { code: 'TX', name: 'Texas (fallback)' }
      ];
      mockGetStateProvinceInformationByCulture.mockResolvedValueOnce(fallbackStateProvinces);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getStateProvinceInformation(cultureInfo);

      expect(mockFetchStatesProvinces).toHaveBeenCalledWith('en-US');
      expect(mockGetStateProvinceInformationByCulture).toHaveBeenCalledWith(cultureInfo);
      expect(result).toEqual(fallbackStateProvinces);
    });

    it('should return empty array when both API and fallback fail', async () => {
      mockFetchStatesProvinces.mockRejectedValueOnce(new Error('API Error'));
      mockGetStateProvinceInformationByCulture.mockRejectedValueOnce(new Error('Fallback Error'));

      const cultureInfo = new CultureInfo('en-US');
      const result = await getStateProvinceInformation(cultureInfo);

      expect(mockFetchStatesProvinces).toHaveBeenCalledWith('en-US');
      expect(mockGetStateProvinceInformationByCulture).toHaveBeenCalledWith(cultureInfo);
      expect(result).toEqual([]);
    });

    it('should clear cache when clearStateProvinceCache is called', async () => {
      
      mockFetchStatesProvinces.mockResolvedValue(mockStateProvincesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // First call
      await getStateProvinceInformation(cultureInfo);
      expect(mockFetchStatesProvinces).toHaveBeenCalledTimes(1);
      
      // Clear cache
      clearStateProvinceCache();
      
      // Second call should fetch again
      await getStateProvinceInformation(cultureInfo);
      expect(mockFetchStatesProvinces).toHaveBeenCalledTimes(2);
    });
  });

  describe('useGetStateProvinceInformation hook', () => {
    it('should return a stable function reference without token', () => {
      const { result, rerender } = renderHook(() => useGetStateProvinceInformation());
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should return a stable function reference with token', () => {
      const { result, rerender } = renderHook(() => useGetStateProvinceInformation());
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should work with the returned function without token', async () => {
      
      mockFetchStatesProvinces.mockResolvedValueOnce(mockStateProvincesResponse);

      const { result } = renderHook(() => useGetStateProvinceInformation());
      
      const cultureInfo = new CultureInfo('en-US');
      const stateProvinceInfo = await result.current(cultureInfo);
      
      expect(stateProvinceInfo).toEqual(expectedStateProvinceInfo);
      expect(mockFetchStatesProvinces).toHaveBeenCalledWith('en-US');
    });

    it('should work with the returned function with token', async () => {
      
      mockFetchStatesProvinces.mockResolvedValueOnce(mockStateProvincesResponse);

      const { result } = renderHook(() => useGetStateProvinceInformation());
      
      const cultureInfo = new CultureInfo('en-US');
      const stateProvinceInfo = await result.current(cultureInfo);
      
      expect(stateProvinceInfo).toEqual(expectedStateProvinceInfo);
      expect(mockFetchStatesProvinces).toHaveBeenCalledWith('en-US');
    });

    it('should maintain stable function reference regardless of props changes', () => {
      const { result, rerender } = renderHook(
        () => useGetStateProvinceInformation(),
        { initialProps: { token: undefined as string | undefined } }
      );
      
      const firstFunction = result.current;
      
      rerender({ token: 'new-token' as string | undefined });
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });
  });
});
