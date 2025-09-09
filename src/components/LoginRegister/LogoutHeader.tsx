import { useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";

export function LogoutHeader() {
  useEffect(() => {
    trackComponent('LogoutHeader', {});
  }, []);
  return (
    <>
      <h1>Logout</h1>
      <p>You are signed in.</p>
    </>
  );
}
