// Fetches author search results from OpenLibrary API
import type { OpenLibraryAuthorSearchResult, OpenLibraryAuthorWorks } from '../types/OpenLibrary';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'InkStainedWretch';
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'idahosa@example.com';

export async function fetchOpenLibraryAuthors(q: string): Promise<OpenLibraryAuthorSearchResult> {
  const BASE_URL = import.meta.env.VITE_OPENLIBRARY_AUTHOR_SEARCH_URL || 'https://openlibrary.org/search/authors.json?q=';
  const url = `${BASE_URL}${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': `${APP_NAME} (${CONTACT_EMAIL})`
    }
  });
  if (!res.ok) {
    throw new Error(`OpenLibrary API error: ${res.status}`);
  }
  return await res.json();
}

export async function fetchOpenLibraryWorksByAuthorKey(key: string, limit: number=100, offset?: number): Promise<OpenLibraryAuthorWorks> {
  const BASE_URL = import.meta.env.VITE_OPENLIBRARY_WORKS_BY_AUTHOR_URL || 'https://openlibrary.org/authors/';
  const url = `${BASE_URL}${key}/works.json?limit=${limit}${offset ? `&offset=${offset}` : ''}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': `${APP_NAME} (${CONTACT_EMAIL})`
    }
  });
  if (!res.ok) {
    throw new Error(`OpenLibrary API error: ${res.status}`);
  }
  return await res.json();
}
