import { describe, it, expect } from 'vitest';
import { googleBooksvolumesAPI } from '../src/services/googleBooksvolumesAPI';

describe('googleBooksvolumesAPI', () => {
  it('should fetch books for a valid query', async () => {
    const books = await googleBooksvolumesAPI('harry potter');
    expect(Array.isArray(books)).toBe(true);
  });
});
