import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPenguinRandomHouseAuthors } from '../src/services/fetchPenguinRandomHouseAuthors';
import type { AuthorResult } from '../src/types/PenguinRandomHouse';

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn();
} else {
  globalThis.fetch = vi.fn();
}
describe('fetchPenguinRandomHouseAuthors', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns authors for a valid query', async () => {
    const mockAuthors: AuthorResult[] = [
      {
        docType: "author",
        id: "1",
        key: "key-1",
        name: "John Doe",
        score: 98,
        url: "authors/john-doe",
        domain: ["penguinrandomhouse.com"],
        title: "Author Title",
        description: "A famous author.",
        author: null,
        authorFirst: "John",
        authorLast: "Doe",
        photoCredit: "PRH",
        onTour: true,
        seriesAuthor: "Series Author",
        seriesIsbn: "1234567890",
        seriesCount: 3,
        keywordId: "keyword-1",
        _embeds: null,
        _links: []
      }
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { results: mockAuthors } })
    } as Response);
    const result = await fetchPenguinRandomHouseAuthors('test');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('key');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].name).toBe('John Doe');
  });

  it('includes authorization header when access token is provided', async () => {
    const mockAuthors: AuthorResult[] = [];
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { results: mockAuthors } })
    } as Response);

    await fetchPenguinRandomHouseAuthors('test', 'test-token');
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        })
      })
    );
  });

  it('does not include authorization header when no access token is provided', async () => {
    const mockAuthors: AuthorResult[] = [];
    const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { results: mockAuthors } })
    } as Response);

    await fetchPenguinRandomHouseAuthors('test');
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
      })
    );
    
    const callArgs = mockFetch.mock.calls[0][1] as RequestInit;
    const headers = callArgs.headers as Record<string, string>;
    expect(headers).not.toHaveProperty('Authorization');
  });

  it('throws error for invalid query or network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchPenguinRandomHouseAuthors('badquery')).rejects.toThrow('Network error');
  });
});
