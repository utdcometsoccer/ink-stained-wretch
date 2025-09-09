import type { FC } from "react";
import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";

export const LoginHeader: FC = () => {
  useEffect(() => {
    trackComponent('LoginHeader', {});
  }, []);
  return (
  <>
    <h1>Login</h1>
    <p>Sign in to your account.</p>
  </>
  );
}
