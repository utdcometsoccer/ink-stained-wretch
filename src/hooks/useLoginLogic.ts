import type { Dispatch } from "react";
import type { Action } from "../types/Action";
import type { LoginLogicResult } from "../types/LoginLogicResult";
import { useMsal } from "@azure/msal-react";
import { useEffect, useReducer, useRef } from "react";
import { getAccessToken } from "../services/getAccessToken";
import type { LoginLocalState } from "../types/LoginLocalState";
import { loginReducer } from '../reducers/loginReducer';
import type { State } from "../types/State";


export function useLoginLogic(
  dispatch: Dispatch<Action>,
  state?: State,
): LoginLogicResult {
  const { instance, accounts } = useMsal();
  const msalReady = typeof accounts !== 'undefined' && Array.isArray(accounts);

  // Countdown logic
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const initialLoginState: LoginLocalState = { countdown: null, showRedirect: false };
  const [loginState, loginDispatch] = useReducer(loginReducer, initialLoginState);

  useEffect(() => {
    async function fetchToken() {
      if (msalReady && state?.isAuthenticated) {
        const token = await getAccessToken();
        dispatch({ type: 'UPDATE_STATE', payload: { authToken: token } });
        loginDispatch({ type: "START_REDIRECT", countdown: 10 });
      } else {
        dispatch({ type: 'UPDATE_STATE', payload: { authToken: null } });
        loginDispatch({ type: "STOP_REDIRECT" });
      }
    }
    fetchToken();
  }, [msalReady, state?.isAuthenticated, dispatch]);

  useEffect(() => {
    if (loginState.showRedirect && loginState.countdown !== null && loginState.countdown > 0) {
      const timer = setTimeout(() => {
        loginDispatch({ type: "TICK" });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (loginState.showRedirect && loginState.countdown === 0) {
      loginDispatch({ type: "STOP_REDIRECT" });
      dispatch({ type: 'SET_UI_STATE', payload: 'domainRegistration' });
    }
  }, [loginState.showRedirect, loginState.countdown, dispatch]);

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
    msalReady,
    handleSignIn: handleSignIn(),
    handleSignOut: handleSignOut(),
    loginState,
    loginDispatch,
    countdownRef: countdownRef as React.RefObject<HTMLDivElement | null>,
  };
}
