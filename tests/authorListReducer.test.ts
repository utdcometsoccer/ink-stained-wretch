import { describe, it, expect } from "vitest";
import { authorListReducer, initialAuthorListState, type AuthorListAction } from '../src/reducers/authorListReducer';

describe('authorListReducer', () => {
  it('should show form for new author', () => {
    const action: AuthorListAction = { type: 'SHOW_FORM', payload: { id: "1", AuthorName: "Test", TopLevelDomain: "", SecondLevelDomain: "", LanguageName: "", RegionName: "", WelcomeText: "", AboutText: "", HeadShotURL: "", CopyrightText: "", EmailAddress: "", Articles: [], Books: [], Socials: [] } };
    const result = authorListReducer(initialAuthorListState, action);
    expect(result.showForm).toBe(true);
    expect(result.newAuthor?.AuthorName).toBe('Test');
  });
});
 