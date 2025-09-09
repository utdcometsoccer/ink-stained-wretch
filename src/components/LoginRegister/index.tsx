import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import type { FC } from "react";
import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";
import { useLoginLogic } from "../../hooks/useLoginLogic";
import { CountdownIndicator } from "../CountdownIndicator";
import { LoginButton } from "./LoginButton";
import { LoginHeader } from "./LoginHeader";
import type { LoginProps } from "./LoginProps";
import "./LoginRegister.css";
import { LogoutButton } from "./LogoutButton";
import { LogoutHeader } from "./LogoutHeader";

export const Login: FC<LoginProps> = ({ state, dispatch }) => {
  useEffect(() => {
    trackComponent('Login', { state });
  }, [state]);

  const {
    handleSignIn,
    handleSignOut,
    loginState,
    countdownRef
  } = useLoginLogic(dispatch, state);

  const { countdown, showRedirect } = loginState;
  return (
    <div>
      <UnauthenticatedTemplate>
        <LoginHeader />
        <LoginButton onSignIn={handleSignIn} className="app-btn" />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <CountdownIndicator
          countdown={countdown ?? undefined}
          showRedirect={showRedirect}
          countdownRef={countdownRef}
          text={`Redirecting to Domain Registration in ${countdown ?? 0} seconds...`}
        />
        <LogoutHeader />
        <LogoutButton onSignOut={handleSignOut} className="app-btn cancel" />
      </AuthenticatedTemplate>
    </div>
  );
}
