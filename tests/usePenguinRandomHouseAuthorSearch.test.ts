import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePenguinRandomHouseAuthorSearch } from '../src/hooks/usePenguinRandomHouseAuthorSearch';
import type { AuthorResult } from '../src/types/PenguinRandomHouse';


describe('usePenguinRandomHouseAuthorSearch', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('fetches authors and sets loading, error, and data', async () => {
        const mockAuthors: AuthorResult[] = [
            { key: 'A1', name: 'Author One', docType: 'author', id: 'id1', score: 100, url: '', domain: [], title: null, description: null, author: null, authorFirst: 'First', authorLast: 'Last', photoCredit: null, onTour: false, seriesAuthor: null, seriesIsbn: null, seriesCount: null, keywordId: null, _embeds: null, _links: [] }
        ];
        const mockFetchFn = vi.fn().mockResolvedValue(mockAuthors);
        const { result } = renderHook(() => usePenguinRandomHouseAuthorSearch('test', mockFetchFn));
        expect(result.current.loading).toBe(true);
        await act(async () => {
            await waitFor(() => expect(result.current.loading).toBe(false));
        });
        expect(result.current.penguinAuthors).toEqual(mockAuthors);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(mockFetchFn).toHaveBeenCalledWith('test');
    });

    it('handles API error correctly', async () => {
        const mockFetchFn = vi.fn().mockRejectedValue(new Error('API error'));
        const { result } = renderHook(() => usePenguinRandomHouseAuthorSearch('test', mockFetchFn));
        expect(result.current.loading).toBe(true);
        await act(async () => {
            await waitFor(() => expect(result.current.loading).toBe(false));
        });
        expect(result.current.penguinAuthors).toBeNull();
        expect(result.current.error).toBe('API error');
        expect(result.current.loading).toBe(false);
        expect(mockFetchFn).toHaveBeenCalledWith('test');
    });
});
