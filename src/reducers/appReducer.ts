import type { UIStates } from "../types/UIStates";
import { saveStateToCookie } from '../services/saveStateToCookie';
import type { AppState } from "../types/AppState";
import type { Action } from "../types/Action";


export type ActionType =
  'SET_UI_STATE'
  | 'SET_ERROR'
  | 'CLEAR_ERROR'
  | 'UPDATE_STATE'
  | 'UPDATE_DOMAIN'
  | 'UPDATE_DOMAIN_CONTACT_INFO'
  | 'SAVE_AUTHOR'
  | 'DELETE_AUTHOR'
  | 'UPDATE_USE_COOKIES'
  | 'SET_DOMAIN_INPUT_VALUE'
  | 'SELECT_DOMAIN_REGISTRATION'  // New action type for selecting a domain registration
  | 'SET_DOMAIN_REGISTRATIONS';  // New action for updating domainRegistrations

export function appReducer(state: AppState, action: Action): AppState {
  let nextState: AppState = state;
  switch (action.type) {
    case 'SELECT_DOMAIN_REGISTRATION':
      nextState = {
        currentUIState: state.currentUIState,
        state: {
          ...state.state,
          domainRegistration: action.payload  // Set the selected domain registration
        }
      };
      break;
    case 'SET_DOMAIN_REGISTRATIONS':
      nextState = {
        currentUIState: state.currentUIState,
        state: {
          ...state.state,
          domainRegistrations: Array.isArray(action.payload) ? action.payload : []
        }
      };
      break;
    case 'SET_UI_STATE': {
      if (typeof action.payload === 'object' && action.payload !== null && 'uiState' in action.payload) {
        nextState = {
          ...state,
          currentUIState: action.payload.uiState,
          state: {
            ...state.state,
            autoDetect: action.payload.autoDetect
          }
        };
      } else {
        nextState = {
          ...state,
          currentUIState: action.payload as UIStates,
          state: {
            ...state.state,
            autoDetect: undefined
          }
        };
      }
      break;
    }
    case 'SET_ERROR':
      nextState = {
        ...state,
        currentUIState: 'error',
        state: {
          ...state.state,
          error: action.payload as string
        }
      };
      break;
    case 'CLEAR_ERROR':
      nextState = {
        ...state,
        state: {
          ...state.state,
          error: undefined
        }
      };
      break;
    case 'UPDATE_STATE': {
      const { ...restPayload } = action.payload || {};
      const newState = {
        ...state.state,
        ...restPayload
      };
      nextState = {
        currentUIState: state.currentUIState,
        state: {
          ...newState
        }
      };
      break;
    }
    case 'UPDATE_DOMAIN':
      nextState = {
        ...state,
        state: {
          ...state.state,
          domainRegistration: {
            ...state.state.domainRegistration,
            domain: action.payload
          }
        }
      };
      break;
    case 'UPDATE_DOMAIN_CONTACT_INFO':
      nextState = {
        ...state,
        state: {
          ...state.state,
          domainRegistration: {
            ...state.state.domainRegistration,
            contactInformation: action.payload
          }
        }
      };
      break;
    case 'SAVE_AUTHOR': {
      const author = action.payload;
      const authors = Array.isArray(state.state.Authors) ? state.state.Authors : [];
      const idx = authors.findIndex((a: any) => a.id === author.id);
      let newAuthors;
      if (idx >= 0) {
        newAuthors = [...authors];
        newAuthors[idx] = author;
      } else {
        newAuthors = [...authors, author];
      }
      nextState = {
        ...state,
        state: {
          ...state.state,
          Authors: newAuthors
        }
      };
      break;
    }
    case 'DELETE_AUTHOR': {
      const id = action.payload;
      const authors = Array.isArray(state.state.Authors) ? state.state.Authors : [];
      const newAuthors = authors.filter((a: any) => a.id !== id);
      nextState = {
        ...state,
        state: {
          ...state.state,
          Authors: newAuthors
        }
      };
      break;
    }
    case 'UPDATE_USE_COOKIES':
      nextState = {
        ...state,
        state: {
          ...state.state,
          useCookies: action.payload as boolean
        }
      };
      break;
    case 'SET_DOMAIN_INPUT_VALUE':
      nextState = {
        ...state,
        state: {
          ...state.state,
          domainRegistration: {
            ...state.state.domainRegistration,
            domain: {
              id: action.payload.id,
              authorID: action.payload.authorID,
              topLevelDomain: action.payload.topLevelDomain,
              secondLevelDomain: action.payload.secondLevelDomain
            }
          }
        }
      };
      break;
    default:
      nextState = state;
      break;
  }
  saveStateToCookie(nextState.state);
  return nextState;
}
