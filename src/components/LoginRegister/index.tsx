import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import type { FC } from "react";
import { useLocalizationContext } from "../../hooks/useLocalizationContext";
import { useLoginLogic } from "../../hooks/useLoginLogic";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { CountdownIndicator } from "../CountdownIndicator";
import { LoginButton } from "./LoginButton";
import { LoginHeader } from "./LoginHeader";
import type { LoginProps } from "./LoginProps";
import "./LoginRegister.css";
import { LogoutButton } from "./LogoutButton";
import { LogoutHeader } from "./LogoutHeader";

export const Login: FC<LoginProps> = ({ state, dispatch }) => {
  
  const localization = useLocalizationContext();
  const loginRegisterText = localization.LoginRegister;
  useTrackComponent('Login', { state, dispatch });

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
        <LoginHeader title={loginRegisterText?.loginHeader.title} subtitle={loginRegisterText?.loginHeader.subtitle} />
        <LoginButton onSignIn={handleSignIn} className="app-btn" label={loginRegisterText?.loginButton.label} />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <CountdownIndicator
          countdown={countdown ?? undefined}
          showRedirect={showRedirect}
          countdownRef={countdownRef}
          text={loginRegisterText.countdownIndicator.text.replace('{countdown}', `${countdown ?? 0}`)}
        />
        <LogoutHeader label={loginRegisterText.logoutButton.label} />
        <LogoutButton onSignOut={handleSignOut} className="app-btn cancel" label={loginRegisterText.logoutButton.label} />
      </AuthenticatedTemplate>
    </div>
  );
}
