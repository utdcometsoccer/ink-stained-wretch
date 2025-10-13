import { describe, it, expect } from "vitest";
import { appReducer } from '../src/reducers/appReducer';
import type { AppState } from "../src/types/AppState";
import type {
  SetUIStateAction,
  SetErrorAction,
  ClearErrorAction,
  UpdateStateAction,
  UpdateDomainAction,
  UpdateDomainContactInfoAction,
  SaveAuthorAction,
  DeleteAuthorAction,
  UpdateUseCookiesAction,
  SetDomainInputValueAction,
  SelectDomainRegistrationAction,
  SetDomainRegistrationsAction
} from "../src/types/actions";

const initialState: AppState = {
  currentUIState: 'chooseCulture',
  state: {}
};

describe('appReducer with strongly typed actions', () => {
  it('should handle SetUIStateAction', () => {
    const action: SetUIStateAction = { type: 'SET_UI_STATE', payload: 'authorPage' };
    const result = appReducer(initialState, action);
    expect(result.currentUIState).toBe('authorPage');
  });

  it('should handle SetErrorAction', () => {
    const action: SetErrorAction = { type: 'SET_ERROR', payload: 'Test error' };
    const result = appReducer(initialState, action);
    expect(result.state.error).toBe('Test error');
    expect(result.currentUIState).toBe('error');
  });

  it('should handle ClearErrorAction', () => {
    const stateWithError = { ...initialState, state: { ...initialState.state, error: 'Test error' } };
    const action: ClearErrorAction = { type: 'CLEAR_ERROR' };
    const result = appReducer(stateWithError, action);
    expect(result.state.error).toBeUndefined();
  });

  it('should handle UpdateStateAction', () => {
    const action: UpdateStateAction = { type: 'UPDATE_STATE', payload: { isAuthenticated: true } };
    const result = appReducer(initialState, action);
    expect(result.state.isAuthenticated).toBe(true);
  });

  it('should handle UpdateUseCookiesAction', () => {
    const action: UpdateUseCookiesAction = { type: 'UPDATE_USE_COOKIES', payload: true };
    const result = appReducer(initialState, action);
    expect(result.state.useCookies).toBe(true);
  });

  it('should handle SetDomainInputValueAction', () => {
    const action: SetDomainInputValueAction = {
      type: 'SET_DOMAIN_INPUT_VALUE',
      payload: {
        topLevelDomain: 'com',
        secondLevelDomain: 'example'
      }
    };
    const result = appReducer(initialState, action);
    expect(result.state.domainRegistration?.domain?.topLevelDomain).toBe('com');
    expect(result.state.domainRegistration?.domain?.secondLevelDomain).toBe('example');
  });

  it('should handle SetDomainRegistrationsAction', () => {
    const action: SetDomainRegistrationsAction = {
      type: 'SET_DOMAIN_REGISTRATIONS',
      payload: [{ id: '1', domain: { topLevelDomain: 'com', secondLevelDomain: 'test' } }]
    };
    const result = appReducer(initialState, action);
    expect(result.state.domainRegistrations).toHaveLength(1);
  });
});
