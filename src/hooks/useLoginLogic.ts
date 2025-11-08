import { useMsal } from "@azure/msal-react";
import type { Dispatch } from "react";
import { useEffect, useReducer, useRef, useState } from "react";
import { loginReducer } from '../reducers/loginReducer';
import { trackEvent } from "../services/applicationInsights";
import { createStripeCustomer } from "../services/createStripeCustomer";
import { getAccessToken } from "../services/getAccessToken";
import { loginRequest } from "../services/msalConfig";
import type { Action } from "../types/Action";
import type { LoginLocalState } from "../types/LoginLocalState";
import type { LoginLogicResult } from "../types/LoginLogicResult";
import type { State } from "../types/State";
import type { UserProfile } from "../types/UserProfile";


export function useLoginLogic(
  dispatch: Dispatch<Action>,
  state?: State,
): LoginLogicResult {
  const { authToken, isAuthenticated } = state || {};
  const { instance, accounts } = useMsal();
  const [msalReady] = useState(() => typeof accounts !== 'undefined' && Array.isArray(accounts));

  // Countdown logic
  const countdownRef = useRef<HTMLDivElement | null>(null);
  const initialLoginState: LoginLocalState = { countdown: null, showRedirect: false };
  const [loginState, loginDispatch] = useReducer(loginReducer, initialLoginState);

  useEffect(() => {
    async function fetchToken() {
      if (msalReady && isAuthenticated ) {
        const token = authToken || await getAccessToken();
        dispatch({ type: 'UPDATE_STATE', payload: { authToken: token } });
        loginDispatch({ type: "START_REDIRECT", countdown: 10 });
      } else {
        dispatch({ type: 'UPDATE_STATE', payload: { authToken: null } });
        loginDispatch({ type: "STOP_REDIRECT" });
      }
    }
    fetchToken();
  }, [authToken, dispatch, isAuthenticated, msalReady]);

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
        const response = await instance.loginPopup({
          ...loginRequest,
          prompt: "select_account"
        });
        const account = response.account || (accounts && accounts[0]);
        if (account) {
          const authToken = response.accessToken || await getAccessToken() || '';
          const userProfile: UserProfile = {
            displayName: account.idTokenClaims?.name || account.name || "",
            userId: account.idTokenClaims?.oid || account.localAccountId,
            emailAddress: (account.idTokenClaims?.email || account.username || "").toString(),
          };
          const { customer } = await createStripeCustomer(userProfile.emailAddress, authToken);
          trackEvent('Stripe_Customer_Created', { customerId: customer.id, userId: userProfile.userId });
          trackEvent('User_Signed_In', { userId: userProfile.userId, email: userProfile.emailAddress });
          dispatch({ type: 'UPDATE_STATE', payload: { userProfile, isAuthenticated: true, customer } });
          dispatch({ type: 'SET_UI_STATE', payload: 'domainRegistration' });
          dispatch({ type: 'UPDATE_STATE', payload: { authToken: authToken } });
        }
      } catch (error) {
        const mode = import.meta.env.MODE;
        let errorMessage = 'An unknown error occurred.';
        if (mode === 'development') {
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error instanceof Error) {
            errorMessage = error.message + (error.stack ? `\n${error.stack}` : '');
          } else if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
            errorMessage = (error as { message: string }).message;
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
