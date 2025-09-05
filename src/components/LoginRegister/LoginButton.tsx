import type { FC } from "react";
import type { LoginButtonProps } from "./LoginButtonProps";

export interface ExtendedLoginButtonProps extends LoginButtonProps {
  className?: string;
}

export const LoginButton: FC<ExtendedLoginButtonProps> = ({ onSignIn, className }) => (
  <button onClick={onSignIn} className={className}>Sign in with Microsoft</button>
);
