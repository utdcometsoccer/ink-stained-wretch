import { type FC } from "react";
import { useLocalizationContext } from "../hooks/useLocalizationContext";
import { useTrackComponent } from "../hooks/useTrackComponent";
import "./ThankYou.css";
import type { ThankYouProps } from "./ThankYouProps";

export const ThankYou:FC<ThankYouProps> = ({ culture="en-us"}) => {
  const localization = useLocalizationContext();
  const text = localization.ThankYou;
  useTrackComponent('ThankYou', { culture });
  return (<>
      <h1 className="thank-you-title">{text.title}</h1>
      <p className="thank-you-message">{text.message}</p>
  </>);
}
