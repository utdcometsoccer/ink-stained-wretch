import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";
import type { LoginLogicResult } from "../../types/LoginLogicResult";
import { useMsal } from "@azure/msal-react";


export function useLoginLogic(  
  dispatch: Dispatch<Action>,  
): LoginLogicResult {
  const { instance, accounts } = useMsal();
  const msalReady = typeof accounts !== 'undefined' && Array.isArray(accounts);
  

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
    handleSignOut: handleSignOut()
  };
}
