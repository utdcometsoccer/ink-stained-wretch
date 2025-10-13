import { type FC } from "react";
import { useLocalizationContext } from "../hooks/useLocalizationContext";
import { useTrackComponent } from "../hooks/useTrackComponent";
import "./ThankYou.css";

export const ThankYou:FC = () => {
  
  const localization = useLocalizationContext();
  const text = localization.ThankYou;
  useTrackComponent('ThankYou',{});
  return (<>
      <h1 className="thank-you-title">{text.title}</h1>
      <p className="thank-you-message">{text.message}</p>
  </>);
}
