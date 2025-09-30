import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPenguinTitlesByAuthorKey } from '../src/services/fetchPenguinTitlesByAuthorKey';

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn();
} else {
  globalThis.fetch = vi.fn();
}

describe('fetchPenguinTitlesByAuthorKey', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockResponse = () => ({
    status: "success",
    recordCount: 1,
    startTimestamp: "2024-01-01T00:00:00Z",
    endTimestamp: "2024-01-01T00:00:01Z",
    timeTaken: 1000,
    data: {
      titles: [{
        isbn: 1234567890,
        isbnHyphenated: "123-4567890",
        title: "Test Book",
        subtitle: null,
        author: "Test Author",
        onsale: "2024-01-01",
        price: [],
        seoFriendlyUrl: "/books/test-book",
        format: { code: "HC", description: "Hardcover" },
        subformat: { code: "", description: "" },
        division: { code: "", description: "" },
        imprint: { code: "", description: "" },
        publisher: { code: "", description: "" },
        pages: 300,
        age: { code: "", description: "" },
        grade: { code: "", description: "" },
        educationGrade: { code: "", description: "" },
        sgmt_desc: null,
        subjects: [],
        trim: "6x9",
        formatFamily: "Print",
        consumerFormat: "Hardcover",
        consumerImprint: null,
        consumerImprintUri: null,
        saleStatus: "Available",
        language: "English",
        seriesNumber: null,
        subseries: null,
        editionType: null,
        propertyName: null,
        _embeds: null,
        _links: []
      }],
      _embeds: null,
      _links: []
    },
    error: null,
    params: {
      authorId: "test-author",
      clientGroup: "test",
      domain: "test"
    },
    requestedMethod: "GET"
  });

  it('returns titles for a valid author key without auth token', async () => {
    const mockResponse = createMockResponse();

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await fetchPenguinTitlesByAuthorKey('test-author', 10, 0);
    expect(result.data.titles).toHaveLength(1);
    expect(result.data.titles[0].title).toBe('Test Book');
    
    // Verify fetch was called without Authorization header
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(URL),
      { headers: {} }
    );
  });

  it('includes Authorization header when auth token is provided', async () => {
    const mockResponse = createMockResponse();
    mockResponse.data.titles = []; // Empty titles for this test

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const testToken = 'test-bearer-token';
    await fetchPenguinTitlesByAuthorKey('test-author', 10, 0, testToken);
    
    // Verify fetch was called with Authorization header
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(URL),
      { headers: { Authorization: `Bearer ${testToken}` } }
    );
  });

  it('handles API errors correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response);

    await expect(fetchPenguinTitlesByAuthorKey('test-author', 10)).rejects.toThrow(
      'Penguin Random House API error: 500'
    );
  });

  it('constructs URL with proper query parameters', async () => {
    const mockResponse = createMockResponse();
    mockResponse.data.titles = []; // Empty titles for this test

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    await fetchPenguinTitlesByAuthorKey('test-author', 25, 50);
    
    const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0];
    const url = fetchCall[0] as URL;
    
    expect(url.searchParams.get('rows')).toBe('25');
    expect(url.searchParams.get('start')).toBe('50');
  });
});