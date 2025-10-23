import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { CultureInfo } from '@idahoedokpayi/react-country-state-selector';
import { getLanguageInformation, getLanguageInformationWithAuth, useGetLanguageInformation, clearLanguageCache } from '../src/services/getLanguageInformation';
import { fetchLanguages } from '../src/services/fetchLanguages';

// Mock the fetchLanguages service
vi.mock('../src/services/fetchLanguages', () => ({
  fetchLanguages: vi.fn()
}));

// Mock withAuthRetry to avoid MSAL dependencies
vi.mock('../src/services/withAuthRetry', () => ({
  withAuthRetry: vi.fn((serviceFn, token) => serviceFn(token))
}));

const mockFetchLanguages = vi.mocked(fetchLanguages);

describe('getLanguageInformation', () => {
  const mockLanguagesResponse = {
    data: [
      {
        code: 'en' as const,
        name: 'English',
        culture: 'en-US'
      },
      {
        code: 'es' as const,
        name: 'Spanish',
        culture: 'en-US'
      }
    ]
  };

  const expectedLanguageInfo = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    clearLanguageCache();
  });

  afterEach(() => {
    clearLanguageCache();
  });

  describe('getLanguageInformationWithAuth function', () => {
    it('should fetch and transform language data correctly with auth token', async () => {
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getLanguageInformationWithAuth(cultureInfo, 'test-token');

      expect(mockFetchLanguages).toHaveBeenCalledWith('en-US', 'test-token');
      expect(result).toEqual(expectedLanguageInfo);
    });

    it('should cache results separately for authenticated and non-authenticated requests', async () => {
      
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);
      
      const mockAuthenticatedResponse = {
        data: [
          {
            code: 'fr' as const,
            name: 'Authenticated French',
            culture: 'en-US'
          }
        ]
      };
      mockFetchLanguages.mockResolvedValueOnce(mockAuthenticatedResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // Call without token (cached as 'en-US')
      const result1 = await getLanguageInformationWithAuth(cultureInfo);
      
      // Call with token (cached as 'en-US-auth')
      const result2 = await getLanguageInformationWithAuth(cultureInfo, 'test-token');

      expect(mockFetchLanguages).toHaveBeenCalledTimes(2);
      expect(mockFetchLanguages).toHaveBeenNthCalledWith(1, 'en-US', undefined);
      expect(mockFetchLanguages).toHaveBeenNthCalledWith(2, 'en-US', 'test-token');
      expect(result1).toEqual(expectedLanguageInfo);
      expect(result2).toEqual([{ code: 'fr', name: 'Authenticated French' }]);
    });
  });

  describe('getLanguageInformation function', () => {
    it('should fetch and transform language data correctly', async () => {
      
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);

      const cultureInfo = new CultureInfo('en-US');
      const result = await getLanguageInformation(cultureInfo);

      expect(mockFetchLanguages).toHaveBeenCalledWith('en-US', undefined);
      expect(result).toEqual(expectedLanguageInfo);
    });

    it('should cache results for the same culture', async () => {
      
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // First call should fetch from API
      const result1 = await getLanguageInformation(cultureInfo);
      
      // Second call should use cache
      const result2 = await getLanguageInformation(cultureInfo);

      expect(mockFetchLanguages).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(expectedLanguageInfo);
      expect(result2).toEqual(expectedLanguageInfo);
      expect(result1).toBe(result2); // Should be the same reference from cache
    });

    it('should handle different cultures separately', async () => {
      
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);
      
      const mockFrenchResponse = {
        data: [
          {
            code: 'fr' as const,
            name: 'Français',
            culture: 'fr-CA'
          }
        ]
      };
      mockFetchLanguages.mockResolvedValueOnce(mockFrenchResponse);

      const cultureInfoUS = new CultureInfo('en-US');
      const cultureInfoCA = new CultureInfo('fr-CA');
      
      const resultUS = await getLanguageInformation(cultureInfoUS);
      const resultCA = await getLanguageInformation(cultureInfoCA);

      expect(mockFetchLanguages).toHaveBeenCalledTimes(2);
      expect(mockFetchLanguages).toHaveBeenNthCalledWith(1, 'en-US', undefined);
      expect(mockFetchLanguages).toHaveBeenNthCalledWith(2, 'fr-CA', undefined);
      expect(resultUS).toEqual(expectedLanguageInfo);
      expect(resultCA).toEqual([{ code: 'fr', name: 'Français' }]);
    });

    it('should return empty array on error', async () => {
      
      mockFetchLanguages.mockRejectedValueOnce(new Error('API Error'));

      const cultureInfo = new CultureInfo('en-US');
      const result = await getLanguageInformation(cultureInfo);

      expect(result).toEqual([]);
    });

    it('should clear cache when clearLanguageCache is called', async () => {
      
      mockFetchLanguages.mockResolvedValue(mockLanguagesResponse);

      const cultureInfo = new CultureInfo('en-US');
      
      // First call
      await getLanguageInformation(cultureInfo);
      expect(mockFetchLanguages).toHaveBeenCalledTimes(1);
      
      // Clear cache
      clearLanguageCache();
      
      // Second call should fetch again
      await getLanguageInformation(cultureInfo);
      expect(mockFetchLanguages).toHaveBeenCalledTimes(2);
    });
  });

  describe('useGetLanguageInformation hook', () => {
    it('should return a stable function reference without token', () => {
      const { result, rerender } = renderHook(() => useGetLanguageInformation());
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should return a stable function reference with token', () => {
      const { result, rerender } = renderHook(() => useGetLanguageInformation('test-token'));
      
      const firstFunction = result.current;
      
      rerender();
      
      const secondFunction = result.current;
      
      expect(firstFunction).toBe(secondFunction);
    });

    it('should work with the returned function without token', async () => {
      
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);

      const { result } = renderHook(() => useGetLanguageInformation());
      
      const cultureInfo = new CultureInfo('en-US');
      const languageInfo = await result.current(cultureInfo);
      
      expect(languageInfo).toEqual(expectedLanguageInfo);
      expect(mockFetchLanguages).toHaveBeenCalledWith('en-US', undefined);
    });

    it('should work with the returned function with token', async () => {
      
      mockFetchLanguages.mockResolvedValueOnce(mockLanguagesResponse);

      const { result } = renderHook(() => useGetLanguageInformation('test-token'));
      
      const cultureInfo = new CultureInfo('en-US');
      const languageInfo = await result.current(cultureInfo);
      
      expect(languageInfo).toEqual(expectedLanguageInfo);
      expect(mockFetchLanguages).toHaveBeenCalledWith('en-US', 'test-token');
    });

    it('should update when token changes', () => {
      const { result, rerender } = renderHook(
        ({ token }: { token?: string }) => useGetLanguageInformation(token),
        { initialProps: { token: undefined as string | undefined } }
      );
      
      const firstFunction = result.current;
      
      rerender({ token: 'new-token' as string | undefined });
      
      const secondFunction = result.current;
      
      expect(firstFunction).not.toBe(secondFunction);
    });
  });
});
