
import type { FC } from "react";
import type { CountdownIndicatorProps } from "./CountdownIndicatorProps";
import "./CountdownIndicator.css";

export const CountdownIndicator: FC<CountdownIndicatorProps> = ({ countdown, showRedirect, countdownRef, text }) => {
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
