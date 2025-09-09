import type { FC } from "react";
import type { LoginButtonProps } from "./LoginButtonProps";

export interface ExtendedLoginButtonProps extends LoginButtonProps {
  className?: string;
}

import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";

export const LoginButton: FC<ExtendedLoginButtonProps> = ({ onSignIn, className }) => {
  useEffect(() => {
    trackComponent('LoginButton', {});
  }, []);
  return (
    <button onClick={onSignIn} className={className}>Sign in with Microsoft</button>
  );
}
