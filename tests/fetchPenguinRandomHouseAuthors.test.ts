import { describe, it, expect, vi } from 'vitest';
import { fetchPenguinRandomHouseAuthors } from '../src/services/fetchPenguinRandomHouseAuthors';
import type { AuthorResult } from '../src/types/PenguinRandomHouse';

describe('fetchPenguinRandomHouseAuthors', () => {
  it('returns authors for a valid query', async () => {
    // Mock fetch if needed, or test with a real endpoint if available
    // For demonstration, assume fetch is mocked elsewhere
    const result = await fetchPenguinRandomHouseAuthors('test');
    expect(Array.isArray(result)).toBe(true);
    // Optionally check shape of result
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('key');
      expect(result[0]).toHaveProperty('name');
    }
  });

  it('throws error for invalid query or network failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchPenguinRandomHouseAuthors('badquery')).rejects.toThrow('Network error');
  });
});
