import type { FC } from 'react';
import { useCountdownIndicatorLogic } from '../../hooks/useCountdownIndicator';
import type { CountdownIndicatorProps } from './CountdownIndicatorProps';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';


export const CountdownIndicator: FC<CountdownIndicatorProps> = ({ countdown, showRedirect, countdownRef, text, culture = 'en-us' }) => {
  useTrackComponent('CountdownIndicator', { countdown, showRedirect, countdownRef, text, culture });
  const localized = useGetLocalizedText(culture)?.CountdownIndicator;
  useCountdownIndicatorLogic(countdown, countdownRef);
  if (!showRedirect || !countdown || countdown <= 0) return null;

  const message = text ?? (localized?.redirecting?.replace('{countdown}', String(countdown)) ?? `Redirecting in ${countdown} seconds...`);
  return (
    <div className="countdown-indicator" ref={countdownRef}>
      <div className="countdown-text">
        {message}
      </div>
      <div className="countdown-bar-bg">
        <div className="countdown-bar-fill" />
      </div>
    </div>
  );
};
