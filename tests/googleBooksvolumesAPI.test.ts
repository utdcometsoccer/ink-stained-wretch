import { describe, it, expect, vi, afterEach } from 'vitest';
import { googleBooksvolumesAPI } from '../src/services/googleBooksvolumesAPI';

describe('googleBooksvolumesAPI', () => {
  afterEach(() => {
        vi.restoreAllMocks();
    });
  it('should fetch books for a valid query', async () => {
    const mockBooks = [
      { id: '1', title: 'Harry Potter and the Sorcerer\'s Stone' },
      { id: '2', title: 'Harry Potter and the Chamber of Secrets' }
    ];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockBooks })
    } as Response);
    const books = await googleBooksvolumesAPI('harry potter');
    expect(Array.isArray(books)).toBe(true);
    expect(books).toEqual(mockBooks);
  });
});
