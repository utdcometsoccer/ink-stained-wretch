import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import type { FC } from "react";
import type { LoginLocalState } from "../../types/LoginLocalState";
import { useEffect, useReducer, useRef } from "react";
import { getAccessToken } from "../../services/getAccessToken";
import { CountdownIndicator } from "../CountdownIndicator";
import { LoginButton } from "./LoginButton";
import { LoginHeader } from "./LoginHeader";
import { useLoginLogic } from "./loginLogic";
import type { LoginProps } from "./LoginProps";
import "./LoginRegister.css";
import { LogoutButton } from "./LogoutButton";
import { LogoutHeader } from "./LogoutHeader";

export const Login: FC<LoginProps> = ({ state, dispatch }) => {
  const countdownRef = useRef<HTMLDivElement>(null);
  const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
  const initialLoginState: LoginLocalState = { countdown: null, showRedirect: false };
  function loginReducer(state: LoginLocalState, action: any): LoginLocalState {
    switch (action.type) {
      case "START_REDIRECT":
        return { ...state, showRedirect: true, countdown: COUNTDOWN_SECONDS };
      case "STOP_REDIRECT":
        return { ...state, showRedirect: false, countdown: null };
      case "TICK":
        return { ...state, countdown: (state.countdown ?? 1) - 1 };
      default:
        return state;
    }
  }
  const [local, localDispatch] = useReducer(loginReducer, initialLoginState);

  const {
    msalReady,
    handleSignIn,
    handleSignOut
  } = useLoginLogic(dispatch);

  useEffect(() => {
    async function fetchToken() {
      if (msalReady && state.isAuthenticated) {
        const token = await getAccessToken();
        dispatch({ type: 'UPDATE_STATE', payload: { authToken: token } });
        localDispatch({ type: "START_REDIRECT" });
      } else {
        dispatch({ type: 'UPDATE_STATE', payload: { authToken: null } });
        localDispatch({ type: "STOP_REDIRECT" });
      }
    }
    fetchToken();
  }, [msalReady, state.isAuthenticated, dispatch]);

  useEffect(() => {
    if (local.showRedirect && local.countdown !== null && local.countdown > 0) {
      const timer = setTimeout(() => {
        localDispatch({ type: "TICK" });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (local.showRedirect && local.countdown === 0) {
      localDispatch({ type: "STOP_REDIRECT" });
      dispatch({ type: 'SET_UI_STATE', payload: 'domainRegistration' });
    }
  }, [local.showRedirect, local.countdown, dispatch]);

  return (
    <div>
      <UnauthenticatedTemplate>
        <LoginHeader />
              <LoginButton onSignIn={handleSignIn} className="app-btn" />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <CountdownIndicator
          countdown={local.countdown}
          showRedirect={local.showRedirect}
          countdownRef={countdownRef}
          text={`Redirecting to Domain Registration in ${local.countdown ?? 0} seconds...`}
        />
        <LogoutHeader />
        <LogoutButton onSignOut={handleSignOut} className="app-btn cancel" />
      </AuthenticatedTemplate>
    </div>
  );
}
