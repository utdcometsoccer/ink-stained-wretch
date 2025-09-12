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

  it('throws error for invalid query or network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchPenguinRandomHouseAuthors('badquery')).rejects.toThrow('Network error');
  });
});
