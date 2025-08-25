import type { UIStates } from "../types/UIStates";
import type { State } from "../types/State";

export interface Action {
  type: 'SET_UI_STATE' | 'SET_ERROR' | 'CLEAR_ERROR' | 'UPDATE_STATE';
  payload?: any;
}

interface AppState {
  currentUIState: UIStates;
  state: State;
}

export const initialState: AppState = {
  currentUIState: 'chooseCulture',
  state: {}
};

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_UI_STATE': {
      // Support payload as either UIStates or { uiState, autoDetect }
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
      return {
        ...state,
        state: {
          ...state.state,
          ...action.payload
        }
      };
    default:
      return state;
  }
}
