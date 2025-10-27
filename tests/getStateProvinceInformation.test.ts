import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { CultureInfo } from '@idahoedokpayi/react-country-state-selector';
import { getStateProvinceInformation, getStateProvinceInformationWithAuth, useGetStateProvinceInformation, clearStateProvinceCache } from '../src/services/getStateProvinceInformation';
import { fetchStatesProvinces } from '../src/services/fetchStatesProvinces';

// Mock the fetchStatesProvinces service
vi.mock('../src/services/fetchStatesProvinces', () => ({
  fetchStatesProvinces: vi.fn()
}));

const mockFetchStatesProvinces = vi.mocked(fetchStatesProvinces);

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

    it('should return empty array on error', async () => {
      
      mockFetchStatesProvinces.mockRejectedValueOnce(new Error('API Error'));

      const cultureInfo = new CultureInfo('en-US');
      const result = await getStateProvinceInformation(cultureInfo);

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
        ({ token }: { token?: string }) => useGetStateProvinceInformation(),
        { initialProps: { token: undefined as string | undefined } }
      );
      
      const firstFunction = result.current;
      
      rerender({ token: 'new-token' as string | undefined });
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });
  });
});
