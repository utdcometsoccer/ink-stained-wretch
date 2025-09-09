import type { State } from '../types/State';

export function saveStateToCookie(state: State) {
  if (state.useCookies) {
    document.cookie = `appState=${encodeURIComponent(JSON.stringify(state))}; path=/;`;
  }
}
