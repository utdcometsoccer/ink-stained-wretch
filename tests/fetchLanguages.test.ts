import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLanguages } from '../src/services/fetchLanguages';
import type { LanguageResponse } from '../src/types/LanguageResponse';
import { UnauthorizedError } from '../src/types/UnauthorizedError';

beforeEach(() => {
  vi.restoreAllMocks();
  // Mock environment variable
  vi.stubGlobal('import.meta', {
    env: {
      VITE_LANGUAGES_API_URL: 'http://localhost:7072/api/languages'
    }
  });
});

describe('fetchLanguages', () => {
  const mockLanguageResponse: LanguageResponse = [
    {
      code: 'en',
      name: 'English'
    },
    {
      code: 'es',
      name: 'Spanish'
    },
    {
      code: 'fr',
      name: 'French'
    }
  ];

  it('returns languages on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockLanguageResponse)
    } as never);

    const result = await fetchLanguages();
    expect(result).toEqual(mockLanguageResponse);
  });

  it('includes culture as route parameter when provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockLanguageResponse)
    } as never);

    await fetchLanguages('en-US');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7072/api/languages/en',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  });



  it('throws UnauthorizedError when response status is 401', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    } as never);

    await expect(fetchLanguages()).rejects.toThrow(UnauthorizedError);
  });

  it('returns fallback data when API response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as never);

    const result = await fetchLanguages();
    
    expect(result).toHaveLength(5);
    expect(result[0].name).toBe('English');
  });

  it('returns fallback data when API URL is not defined', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('import.meta', {
      env: {
        VITE_LANGUAGES_API_URL: ''
      }
    });

    const result = await fetchLanguages();
    
    expect(result).toHaveLength(5);
    expect(result[0].name).toBe('English');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch languages from remote service, using fallback data:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });

  it('returns fallback data when network request fails', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchLanguages();

    expect(result).toEqual([
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" }
    ]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch languages from remote service, using fallback data:',
      expect.any(Error)
    );
    
    consoleSpy.mockRestore();
  });
});
