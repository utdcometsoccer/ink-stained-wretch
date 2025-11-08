import type { FC } from 'react';
import { useCountdownIndicatorLogic } from '../../hooks/useCountdownIndicator';
import type { CountdownIndicatorProps } from './CountdownIndicatorProps';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { useCultureInfo } from '../../hooks/useCultureInfo';


export const CountdownIndicator: FC<CountdownIndicatorProps> = ({ countdown, showRedirect, countdownRef, text }) => {
  const { culture } = useCultureInfo();
  useTrackComponent('CountdownIndicator', { countdown, showRedirect, countdownRef, text, culture });
  const localization = useLocalizationContext();
  const localized = localization.CountdownIndicator;
  useCountdownIndicatorLogic(countdown, countdownRef);
  if (!showRedirect || !countdown || countdown <= 0) return null;

  const message = text ?? localized.redirecting.replace('{countdown}', String(countdown));
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
