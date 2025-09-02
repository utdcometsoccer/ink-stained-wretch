import type { UIStates } from "../types/UIStates";
import type { State } from "../types/State";
import { extractSelectedRegion } from "../services/extractSelectedRegion";
import { getLanguageFromCulture } from "../services/getLanguageFromCulture";

export interface Action {
  type:
    | 'SET_UI_STATE'
    | 'SET_ERROR'
    | 'CLEAR_ERROR'
    | 'UPDATE_STATE'
    | 'UPDATE_DOMAIN_INPUT_VALUE'
    | 'UPDATE_DOMAIN_ERROR'
    | 'UPDATE_DOMAIN'
    | 'UPDATE_DOMAIN_CONTACT_INFO'
    | 'UPDATE_AUTHOR_INFO'
    | 'UPDATE_AUTHOR_ERROR';
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
      // ...existing code...
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
    case 'UPDATE_STATE':
      {
        // Merge new state
        const newState = {
          ...state.state,
          ...action.payload
        };

        // Dependency: selectedRegion and stateProvinceOptions depend on country and culture
        const domainContactInfo = newState.domainContactInfo || newState.domainRegistration?.contactInformation;
        const culture = newState.culture;
        const selectedRegion = extractSelectedRegion(domainContactInfo, culture);
     
        // Dependency: selectedLanguage depends on culture
        const selectedLanguage = culture ? getLanguageFromCulture(culture) : undefined;

        return {
          ...state,
          state: {
            ...newState,
            selectedRegion,
            selectedLanguage,
          }
        };
      }
    case 'UPDATE_DOMAIN_INPUT_VALUE':
      return {
        ...state,
        state: {
          ...state.state,
          domainInputValue: action.payload
        }
      };
    case 'UPDATE_DOMAIN_ERROR':
      return {
        ...state,
        state: {
          ...state.state,
          domainError: action.payload
        }
      };
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
    case 'UPDATE_AUTHOR_INFO':
      return {
        ...state,
        state: {
          ...state.state,
          authorInfo: action.payload
        }
      };
    case 'UPDATE_AUTHOR_ERROR':
      return {
        ...state,
        state: {
          ...state.state,
          authorError: action.payload
        }
      };
    default:
      return state;
  }
}
