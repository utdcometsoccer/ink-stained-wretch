import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PenguinRandomHouseAuthorImport } from '../src/components/PenguinRandomHouseAuthorImport';
import type { AuthorResult } from '../src/types/PenguinRandomHouseSearchResult';

describe('PenguinRandomHouseAuthorImport', () => {
  const authors: AuthorResult[] = [
    { key: 'A1', name: 'Author One', docType: 'author', id: 'id1', score: 100, url: '', domain: [], title: null, description: null, author: null, authorFirst: 'First', authorLast: 'Last', photoCredit: null, onTour: false, seriesAuthor: null, seriesIsbn: null, seriesCount: null, keywordId: null, _embeds: null, _links: [] },
    { key: 'A2', name: 'Author Two', docType: 'author', id: 'id2', score: 90, url: '', domain: [], title: null, description: null, author: null, authorFirst: 'First', authorLast: 'Last', photoCredit: null, onTour: false, seriesAuthor: null, seriesIsbn: null, seriesCount: null, keywordId: null, _embeds: null, _links: [] }
  ];

  it('renders author list and disables imported authors', () => {
    const onAuthorClick = vi.fn();
    const onImport = vi.fn();
    const onGoBack = vi.fn();
    const mockAuthorSearchHook = vi.fn().mockReturnValue({
      penguinAuthors: authors,
      error: null,
      loading: false
    });
    render(
      <PenguinRandomHouseAuthorImport
        query="test"
        onAuthorClick={onAuthorClick}
        onImport={onImport}
        onGoBack={onGoBack}
        importedKeys={[authors[1].key]}
        culture="en-us"
        authorSearchHook={mockAuthorSearchHook}
      />
    );
    expect(screen.getByText('Author One')).toBeInTheDocument();
    expect(screen.getByText('Author Two')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Import/i })[1]).toBeDisabled();
  });

  it('calls onAuthorClick and onImport', () => {
    const onAuthorClick = vi.fn();
    const onImport = vi.fn();
    const onGoBack = vi.fn();
    const mockAuthorSearchHook = vi.fn().mockReturnValue({
      penguinAuthors: authors,
      error: null,
      loading: false
    });
    render(
      <PenguinRandomHouseAuthorImport
        query="test"
        onAuthorClick={onAuthorClick}
        onImport={onImport}
        onGoBack={onGoBack}
        importedKeys={[]}
        culture="en-us"
        authorSearchHook={mockAuthorSearchHook}
      />
    );
    fireEvent.click(screen.getByText('Author One'));
    expect(onAuthorClick).toHaveBeenCalledWith(authors[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /Import/i })[0]);
    expect(onImport).toHaveBeenCalledWith(authors[0]);
  });

  it('calls onGoBack', () => {
    const onAuthorClick = vi.fn();
    const onImport = vi.fn();
    const onGoBack = vi.fn();
    const mockAuthorSearchHook = vi.fn().mockReturnValue({
      penguinAuthors: authors,
      error: null,
      loading: false
    });
    render(
      <PenguinRandomHouseAuthorImport
        query="test"
        onAuthorClick={onAuthorClick}
        onImport={onImport}
        onGoBack={onGoBack}
        importedKeys={[]}
        culture="en-us"
        authorSearchHook={mockAuthorSearchHook}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Go Back/i }));
    expect(onGoBack).toHaveBeenCalled();
  });
});
