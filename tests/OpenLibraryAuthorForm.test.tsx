import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OpenLibraryAuthorForm } from '../src/components/OpenLibraryAuthorForm';
import type { AuthorDoc } from '../src/types/OpenLibrary';

describe('OpenLibraryAuthorForm', () => {
  const authorDoc: AuthorDoc = {
    key: 'A1',
    text: ['foo'],
    type: 'person',
    name: 'Author One',
    alternate_names: ['Alt One'],
    birth_date: '1970',
    top_work: 'Work One',
    work_count: 4,
    top_subjects: ['subject'],
    _version_: 9
  };

  it('renders all fields', () => {
    render(
      <OpenLibraryAuthorForm
        initialAuthorDoc={authorDoc}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue('A1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Author One')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1970')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Work One')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9')).toBeInTheDocument();
  });

  it('calls onSave and onCancel', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    render(
      <OpenLibraryAuthorForm
        initialAuthorDoc={authorDoc}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(onSave).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
