import type { UIStates } from "../types/UIStates";
import type { State } from "../types/State";

export interface Action {
  type:
    | 'SET_UI_STATE'
    | 'SET_ERROR'
    | 'CLEAR_ERROR'
    | 'UPDATE_STATE'    // isMenuOpen will be managed locally in Navbar
    | 'UPDATE_DOMAIN'
    | 'UPDATE_DOMAIN_CONTACT_INFO'
    | 'SAVE_AUTHOR'
    | 'DELETE_AUTHOR';
  payload?: any;
}

interface AppState {
  currentUIState: UIStates;
  state: State;
}

export const initialState: AppState = {
  currentUIState: 'chooseCulture',
  state: {
  }
};

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_UI_STATE': {
      if (typeof action.payload === 'object' && action.payload !== null && 'uiState' in action.payload) {
        return {
          ...state,
          currentUIState: action.payload.uiState,
          state: {
            ...state.state,
            autoDetect: action.payload.autoDetect
          }
        };
      } else {
        return {
          ...state,
          currentUIState: action.payload as UIStates,
          state: {
            ...state.state,
            autoDetect: undefined
          }
        };
      }
    }
    case 'SET_ERROR':
      return {
        ...state,
        currentUIState: 'error',
        state: {
          ...state.state,
          error: action.payload as string
        }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        state: {
          ...state.state,
          error: undefined
        }
      };
    case 'UPDATE_STATE': {
      // Merge new state, but ignore isMenuOpen
      const { ...restPayload } = action.payload || {};
      const newState = {
        ...state.state,
        ...restPayload
      };
      return {
        ...state,
        state: {
          ...newState
        }
      };
    }
    case 'UPDATE_DOMAIN':
      return {
        ...state,
        state: {
          ...state.state,
          domainRegistration: {
            ...state.state.domainRegistration,
            domain: action.payload
          }
        }
      };
    case 'UPDATE_DOMAIN_CONTACT_INFO':
      return {
        ...state,
        state: {
          ...state.state,
          domainRegistration: {
            ...state.state.domainRegistration,
            contactInformation: action.payload
          }
        }
      };
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
      return {
        ...state,
        state: {
          ...state.state,
          Authors: newAuthors
        }
      };
    }
    case 'DELETE_AUTHOR': {
      const id = action.payload;
      const authors = Array.isArray(state.state.Authors) ? state.state.Authors : [];
      const newAuthors = authors.filter((a: any) => a.id !== id);
      return {
        ...state,
        state: {
          ...state.state,
          Authors: newAuthors
        }
      };
    }
    default:
      return state;
  }
}
