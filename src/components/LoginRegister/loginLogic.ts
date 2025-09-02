import type { State } from "../../types/State";
import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";
import type { LoginLogicResult } from "../../types/LoginLogicResult";
import { useMsal } from "@azure/msal-react";


export function useLoginLogic(
  state: State,
  dispatch: Dispatch<LoginAction>,
  countdownRef: React.RefObject<HTMLDivElement | null>
): LoginLogicResult {

  const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
  const { instance, accounts } = useMsal();
  const msalReady = typeof accounts !== 'undefined' && Array.isArray(accounts);

  function updateCountdownWidth() {
    if (countdownRef.current) {
      const percent = `${(COUNTDOWN_SECONDS - (state.countdown ?? 0)) * (100 / COUNTDOWN_SECONDS)}%`;
      countdownRef.current.style.setProperty('--countdown-width', percent);
    }
  }

  function handleSignIn() {
    return async () => {
      try {
        const scopeArray = import.meta.env.VITE_ENTRA_SCOPES.split(",");
        const response = await instance.loginPopup({
          scopes: scopeArray,
          authority: import.meta.env.VITE_ENTRA_AUTHORITY,
          prompt: "select_account"
        });
        const account = response.account || (accounts && accounts[0]);
        if (account) {
          const userProfile = {
            username: account.username,
            name: account.name,
            homeAccountId: account.homeAccountId,
            localAccountId: account.localAccountId,
            environment: account.environment
          };
          dispatch({ type: 'UPDATE_STATE', payload: { userProfile, isAuthenticated: true } });
          dispatch({ type: 'SET_UI_STATE', payload: 'domainRegistration' });
        }
      } catch (error) {
        const mode = import.meta.env.MODE;
        let errorMessage = 'An unknown error occurred.';
        if (mode === 'development') {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof Error) {
            errorMessage = error.message + (error.stack ? `\n${error.stack}` : '');
          } else if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
            errorMessage = (error as any).message;
          }
        } else {
          errorMessage = 'An error occurred during sign in. Please try again.';
        }
        dispatch({ type: 'UPDATE_STATE', payload: { error: errorMessage } });
      }
    };
  }

  function handleSignOut() {
    return () => {
      instance.logoutPopup();
    };
  }

  return {
    COUNTDOWN_SECONDS,
    msalReady,
    updateCountdownWidth,
    handleSignIn: handleSignIn(),
    handleSignOut: handleSignOut()
  };
}
