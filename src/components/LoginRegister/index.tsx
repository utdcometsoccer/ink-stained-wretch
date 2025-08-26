import { useMsal } from "@azure/msal-react";
import React from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import type { State } from "../../types/State";
import "./LoginRegister.css";

interface LoginProps {
  state: State;
  dispatch: React.Dispatch<any>;
}

export function Login({ state, dispatch }: LoginProps) {
  const countdownRef = React.useRef<HTMLDivElement>(null);
  const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
  // Update CSS variable for countdown width
  React.useEffect(() => {
    if (countdownRef.current) {
      const percent = `${(COUNTDOWN_SECONDS - (state.countdown ?? 0)) * (100 / COUNTDOWN_SECONDS)}%`;
      countdownRef.current.style.setProperty('--countdown-width', percent);
    }
  }, [state.countdown, COUNTDOWN_SECONDS]);
  const { instance, accounts } = useMsal();
  // Only use accounts if initialized
  const msalReady = typeof accounts !== 'undefined' && Array.isArray(accounts);
  // Start countdown when authenticated
  React.useEffect(() => {
    if (msalReady && accounts.length > 0) {
      dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: true, countdown: COUNTDOWN_SECONDS } });
    } else {
      dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: false, countdown: null } });
    }
  }, [msalReady, accounts, dispatch, COUNTDOWN_SECONDS]);

  // Countdown effect
  React.useEffect(() => {
    if (state.showRedirect && state.countdown !== null && (state.countdown ?? 0) > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'UPDATE_STATE', payload: { countdown: (state.countdown ?? 1) - 1 } });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state.showRedirect && state.countdown === 0) {
      dispatch({ type: 'UPDATE_STATE', payload: { countdown: null } });
      dispatch({ type: 'SET_UI_STATE', payload: 'domainRegistration' });
    }
  }, [state.showRedirect, state.countdown, dispatch]);
  // ...existing code...

  const handleSignIn = async () => {
    try {
      const response = await instance.loginPopup({
        scopes: import.meta.env.VITE_ENTRA_SCOPES.split(","),
        authority: import.meta.env.VITE_ENTRA_AUTHORITY,
        prompt: "select_account"
      });
      // Extract basic user profile info from MSAL account
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
      let errorMessage = 'An unknown error occurred.';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
        errorMessage = (error as any).message;
      }
      dispatch({ type: 'UPDATE_STATE', payload: { error: errorMessage } });
    }
  };

  const handleSignOut = () => {
    instance.logoutPopup();
  };

  return (
    <div>
      <UnauthenticatedTemplate>
        <h1>Login</h1>
        <p>Sign in to your account.</p>
        <button onClick={handleSignIn}>Sign in with Microsoft</button>
        {/* Add login/register form here */}
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <h1>Logout</h1>
        <p>You are signed in.</p>
        <button onClick={handleSignOut}>Sign out</button>
        {state.showRedirect && state.countdown !== null && (state.countdown ?? 0) > 0 && (
          <div
            className="countdown-indicator"
            ref={countdownRef}
          >
            <div className="countdown-text">
              Redirecting to Domain Registration in {state.countdown} seconds...
            </div>
            <div className="countdown-bar-bg">
              <div className="countdown-bar-fill" />
            </div>
          </div>
        )}
      </AuthenticatedTemplate>
    </div>
  );
}
