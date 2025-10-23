import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLanguages } from '../src/services/fetchLanguages';
import type { LanguageResponse } from '../src/types/LanguageResponse';
import { UnauthorizedError } from '../src/types/UnauthorizedError';

beforeEach(() => {
  vi.restoreAllMocks();
  // Mock environment variable
  vi.stubEnv('VITE_LANGUAGES_API_URL', 'http://localhost:7001/api/languages');
});

describe('fetchLanguages', () => {
  const mockLanguageResponse: LanguageResponse = {
    data: [
      {
        code: 'en',
        name: 'English',
        culture: 'en-US'
      },
      {
        code: 'es',
        name: 'Spanish',
        culture: 'es-MX'
      },
      {
        code: 'fr',
        name: 'French',
        culture: 'fr-CA'
      }
    ]
  };

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
      'http://localhost:7001/api/languages/en-US',
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
      json: vi.fn().mockResolvedValueOnce(mockLanguageResponse)
    } as never);

    await fetchLanguages(undefined, 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/languages',
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

  it('includes both culture and authorization when both are provided', async () => {
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockResolvedValueOnce(mockLanguageResponse)
    } as never);

    await fetchLanguages('en-US', 'test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:7001/api/languages/en-US',
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

  it('throws UnauthorizedError when response status is 401', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    } as never);

    await expect(fetchLanguages()).rejects.toThrow(UnauthorizedError);
  });

  it('throws error when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as never);

    await expect(fetchLanguages()).rejects.toThrow('Failed to fetch languages: 500 Internal Server Error');
  });

  it('throws error when API URL is not defined', async () => {
    vi.stubEnv('VITE_LANGUAGES_API_URL', '');

    await expect(fetchLanguages()).rejects.toThrow('API URL is not defined in VITE_LANGUAGES_API_URL environment variable');
  });

  it('handles network errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchLanguages()).rejects.toThrow('Error fetching languages: Network error');
  });
});
