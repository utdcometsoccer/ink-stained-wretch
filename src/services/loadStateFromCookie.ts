import type { AppState } from "../types/AppState";


export function loadStateFromCookie(): AppState {
    const initialState: AppState = {
        currentUIState: 'chooseCulture',
        state: {
        }
    };
    const cookieMatch = document.cookie.match(/(?:^|; )appState=([^;]*)/);
    if (cookieMatch && cookieMatch[1]) {
        try {
            const parsed = JSON.parse(decodeURIComponent(cookieMatch[1]));
            return {
                ...initialState,
                state: parsed,
                currentUIState: initialState.currentUIState === 'chooseCulture' ? 'login' : initialState.currentUIState // Move past chooseCulture if state is loaded from cookie
            };
        } catch {
            // If parsing fails, fallback to initialState
            return initialState;
        }
    }
    return initialState;
}
