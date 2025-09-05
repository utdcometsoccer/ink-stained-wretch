import { useRef, useEffect } from "react";
import { getAccessToken } from "../../services/getAccessToken";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import type { State } from "../../types/State";
import type { Action } from "../../reducers/appReducer";
import "./LoginRegister.css";
import { useLoginLogic } from "./loginLogic";
import { LoginHeader } from "./LoginHeader";
import { LoginButton } from "./LoginButton";
import { LogoutHeader } from "./LogoutHeader";
import { LogoutButton } from "./LogoutButton";
import { CountdownIndicator } from "../CountdownIndicator";

interface LoginProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function Login({ state, dispatch }: LoginProps) {
  const countdownRef = useRef<HTMLDivElement>(null);
  const {
    COUNTDOWN_SECONDS,
    msalReady,
    updateCountdownWidth,
    handleSignIn,
    handleSignOut
  } = useLoginLogic(state, dispatch, countdownRef);

  useEffect(() => {
    updateCountdownWidth();
  }, [state.countdown, COUNTDOWN_SECONDS, updateCountdownWidth]);

  useEffect(() => {
    async function fetchToken() {
      if (msalReady && state.isAuthenticated) {
        const token = await getAccessToken();
        dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: true, countdown: COUNTDOWN_SECONDS, authToken: token } });
      } else {
        dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: false, countdown: null, authToken: null } });
      }
    }
    fetchToken();
  }, [msalReady, state.isAuthenticated, dispatch, COUNTDOWN_SECONDS]);

  useEffect(() => {
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

  return (
    <div>
      <UnauthenticatedTemplate>
        <LoginHeader />
        <LoginButton onSignIn={handleSignIn} className="app-btn" />
        {/* Add login/register form here */}
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <CountdownIndicator
          countdown={state.countdown}
          showRedirect={state.showRedirect}
          countdownRef={countdownRef}
          text={`Redirecting to Domain Registration in ${state.countdown ?? 0} seconds...`}
        />
        <LogoutHeader />
        <LogoutButton onSignOut={handleSignOut} className="app-btn cancel" />
      </AuthenticatedTemplate>
    </div>
  );
}
