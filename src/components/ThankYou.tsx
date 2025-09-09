import "./ThankYou.css";
import { useEffect } from "react";
import { trackComponent } from "../services/trackComponent";

export const ThankYou = () => {
  useEffect(() => {
    trackComponent('ThankYou', {});
  }, []);
  return (
    <div className="thank-you-container">
      <h1 className="thank-you-title">Thank You</h1>
      <p className="thank-you-message">Thank you for your purchase!</p>
      {/* Add thank you message and next steps here */}
    </div>
  );
}
