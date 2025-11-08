import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBrowserCultureWithFallback } from '../src/services/getBrowserCultureWithFallback';
import { cultureFromBrowser, CultureInfo } from '@idahoedokpayi/react-country-state-selector';

// Mock the external library
vi.mock('@idahoedokpayi/react-country-state-selector', () => ({
  cultureFromBrowser: vi.fn()
}));

describe('getBrowserCultureWithFallback', () => {
  let mockCultureFromBrowser: ReturnType<typeof vi.mocked<typeof cultureFromBrowser>>;

  beforeEach(() => {
    // Get the mocked function
    mockCultureFromBrowser = vi.mocked(cultureFromBrowser);
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('when browser culture is valid', () => {
    it('should return browser culture with lowercase culture string', () => {
      mockCultureFromBrowser.mockReturnValue(
        new CultureInfo('fr-CA')
      );

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'fr',
        Country: 'CA',
        Culture: 'fr-ca'
      });
    });

    it('should handle uppercase browser culture correctly', () => {
      mockCultureFromBrowser.mockReturnValue(
        new CultureInfo('es-MX')
      );

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'ES',
        Country: 'MX',
        Culture: 'es-mx'
      });
    });
  });

  describe('when browser culture is invalid', () => {
    it('should return default when Language is missing', () => {
      mockCultureFromBrowser.mockReturnValue(
        new CultureInfo('en-US')
      );

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });

    it('should return default when Country is missing', () => {
      mockCultureFromBrowser.mockReturnValue(
        new CultureInfo('en-US')
      );

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });

    it('should return default when Language is too short', () => {
      mockCultureFromBrowser.mockReturnValue({
        Language: 'e',
        Country: 'US',
        Culture: 'e-US'
      });

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });

    it('should return default when Country is too short', () => {
      mockCultureFromBrowser.mockReturnValue({
        Language: 'en',
        Country: 'U',
        Culture: 'en-U'
      });

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });

    it('should return default when cultureFromBrowser returns null', () => {
      mockCultureFromBrowser.mockReturnValue(null);

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });

    it('should return default when cultureFromBrowser throws error', () => {
      mockCultureFromBrowser.mockImplementation(() => {
        throw new Error('Browser culture detection failed');
      });

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });
  });

  describe('fallback behavior', () => {
    it('should return en-us as ultimate fallback when browser culture is invalid', () => {
      mockCultureFromBrowser.mockReturnValue(null);

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });
  });

  describe('ultimate fallback', () => {
    it('should return en-us when no valid options are available', () => {
      mockCultureFromBrowser.mockReturnValue(undefined);
      // No environment variables set

      const result = getBrowserCultureWithFallback();

      expect(result).toEqual({
        Language: 'en',
        Country: 'US',
        Culture: 'en-us'
      });
    });
  });
});