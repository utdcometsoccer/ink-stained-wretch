import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import type { FC } from "react";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";
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
  const culture = state.cultureInfo?.Culture|| 'en-us';  
  const loginRegisterText = useGetLocalizedText(culture)?.LoginRegister;
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
        <LoginHeader title={loginRegisterText?.loginHeader.title ?? 'Login'} subtitle={loginRegisterText?.loginHeader.subtitle ?? 'Sign in to your account.'} />
        <LoginButton onSignIn={handleSignIn} className="app-btn" label={loginRegisterText?.loginButton.label ?? 'Sign in with Microsoft'} />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <CountdownIndicator
          countdown={countdown ?? undefined}
          showRedirect={showRedirect}
          countdownRef={countdownRef}
          text={loginRegisterText ? loginRegisterText.countdownIndicator.text.replace('{countdown}', `${countdown ?? 0}`) : `Redirecting to Domain Registration in ${countdown ?? 0} seconds...`}
        />
        <LogoutHeader label={loginRegisterText?.logoutButton.label ?? 'Sign out'} />
        <LogoutButton onSignOut={handleSignOut} className="app-btn cancel" label={loginRegisterText?.logoutButton.label ?? 'Sign out'} />
      </AuthenticatedTemplate>
    </div>
  );
}
