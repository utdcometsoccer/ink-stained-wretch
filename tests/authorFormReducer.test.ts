import { describe, it, expect } from "vitest";
import { authorFormReducer, initialAuthorFormState } from '../src/reducers/authorFormReducer';
import type { AuthorFormAction } from "../src/types/AuthorFormAction";

describe('authorFormReducer', () => {
  it('should update a field', () => {
    const action: AuthorFormAction = { type: 'UPDATE_FIELD', payload: { name: 'AuthorName', value: 'Test Author' } };
    const result = authorFormReducer(initialAuthorFormState, action);
    expect(result.AuthorName).toBe('Test Author');
  });

  it('should add an article', () => {
    const action: AuthorFormAction = { type: 'ADD_ARTICLE', payload: { id: '1', Title: 'Article 1' } };
    const result = authorFormReducer(initialAuthorFormState, action);
    expect(result.Articles.length).toBe(1);
    expect(result.Articles[0].Title).toBe('Article 1');
  });

  it('should set domain', () => {
    const action: AuthorFormAction = { type: 'SET_DOMAIN', payload: { topLevelDomain: 'com', secondLevelDomain: 'example' } };
    const result = authorFormReducer(initialAuthorFormState, action);
    expect(result.TopLevelDomain).toBe('com');
    expect(result.SecondLevelDomain).toBe('example');
  });
});
