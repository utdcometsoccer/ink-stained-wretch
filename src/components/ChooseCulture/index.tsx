import { useEffect } from "react";
import { autoDetectCulture } from "./autoDetectCulture";
import { AutoDetectLoading } from "./AutoDetectLoading";
import './ChooseCulture.css';
import { ChooseCultureForm } from './ChooseCultureForm';
import type { ChooseCultureProps } from "./ChooseCultureProps";

export function ChooseCulture({ state, dispatch }: ChooseCultureProps) {
  useEffect(() => {
    autoDetectCulture(state, dispatch);
  }, [state, dispatch]);

  // If this is first visit and we're auto-detecting, show loading state
  if ((state.isFirstVisitCulture ?? true) && !state.cultureInfo) return <AutoDetectLoading />;

  return (
    <div className="choose-culture-container">
      <h1>Choose Your Language and Region</h1>
      <p>Select your preferred language and region for the best experience.</p>

      {state.cultureInfo && (
        <ChooseCultureForm
          cultureInfo={state.cultureInfo}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
