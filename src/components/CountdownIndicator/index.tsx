import type { FC } from "react";

import type { CountdownIndicatorProps } from "./CountdownIndicatorProps";


import { useEffect } from "react";

export const CountdownIndicator: FC<CountdownIndicatorProps> = ({ countdown, showRedirect, countdownRef, text }) => {
  const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
  useEffect(() => {
    if (countdownRef?.current) {
      const percent = `${(COUNTDOWN_SECONDS - (countdown ?? 0)) * (100 / COUNTDOWN_SECONDS)}%`;
      countdownRef.current.style.setProperty('--countdown-width', percent);
    }
  }, [countdown, COUNTDOWN_SECONDS, countdownRef]);

  if (!showRedirect || !countdown || countdown <= 0) return null;
  return (
    <div className="countdown-indicator" ref={countdownRef}>
      <div className="countdown-text">
        {text}
      </div>
      <div className="countdown-bar-bg">
        <div className="countdown-bar-fill" />
      </div>
    </div>
  );
};
