import { type FC } from "react";
import { useGetLocalizedText } from "../hooks/useGetLocalizedText";
import { useTrackComponent } from "../hooks/useTrackComponent";
import "./ThankYou.css";
import type { ThankYouProps } from "./ThankYouProps";

export const ThankYou:FC<ThankYouProps> = ({ culture="en-us"}) => {
  const localized = useGetLocalizedText(culture);
  useTrackComponent('ThankYou', { culture });
  return (
    <div className="thank-you-container">
      <h1 className="thank-you-title">{localized?.ThankYou.title ?? 'Thank You'}</h1>
      <p className="thank-you-message">{localized?.ThankYou.message ?? 'Thank you for your purchase!'}</p>
      {/* Add thank you message and next steps here */}
    </div>
  );
}
