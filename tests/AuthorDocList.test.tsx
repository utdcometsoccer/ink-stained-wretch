import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthorDocList from '../src/components/AuthorRegistration/AuthorDocList';
import type { AuthorDoc } from '../src/types/OpenLibrary';

describe('AuthorDocList', () => {
  const authors: AuthorDoc[] = [
    {
      key: 'A1',
      text: ['foo'],
      type: 'person',
      name: 'Author One',
      alternate_names: [],
      birth_date: '1970',
      top_work: 'Work One',
      work_count: 1,
      top_subjects: [],
      _version_: 1
    },
    {
      key: 'A2',
      text: ['bar'],
      type: 'person',
      name: 'Author Two',
      alternate_names: [],
      birth_date: '1980',
      top_work: 'Work Two',
      work_count: 2,
      top_subjects: [],
      _version_: 1
    }
  ];

  it('renders author docs and disables imported ones', () => {
    const onAuthorClick = vi.fn();
    const onImport = vi.fn();
    const onGoBack = vi.fn();
    render(
      <AuthorDocList
        authors={authors}
        importedKeys={['A2']}
        onAuthorClick={onAuthorClick}
        onImport={onImport}
        onGoBack={onGoBack}
      />
    );
    expect(screen.getByText('Author One')).toBeInTheDocument();
    expect(screen.getByText('Author Two')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /import/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /import/i })[1]).toBeDisabled();
  });

  it('calls onAuthorClick and onImport', () => {
    const onAuthorClick = vi.fn();
    const onImport = vi.fn();
    const onGoBack = vi.fn();
    render(
      <AuthorDocList
        authors={authors}
        importedKeys={[]}
        onAuthorClick={onAuthorClick}
        onImport={onImport}
        onGoBack={onGoBack}
      />
    );
    fireEvent.click(screen.getByText('Author One'));
    expect(onAuthorClick).toHaveBeenCalledWith(authors[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /import/i })[0]);
    expect(onImport).toHaveBeenCalledWith(authors[0]);
  });

  it('calls onGoBack', () => {
    const onAuthorClick = vi.fn();
    const onImport = vi.fn();
    const onGoBack = vi.fn();
    render(
      <AuthorDocList
        authors={authors}
        importedKeys={[]}
        onAuthorClick={onAuthorClick}
        onImport={onImport}
        onGoBack={onGoBack}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /go back/i }));
    expect(onGoBack).toHaveBeenCalled();
  });
});
