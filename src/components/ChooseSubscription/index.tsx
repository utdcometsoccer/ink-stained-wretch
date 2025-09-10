import { useChooseSubscriptionLogic } from '../../hooks/useChooseSubscription';
import type { State } from '../../types/State';
import "./ChooseSubscription.css";
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { useGetLocalizedText } from '../../hooks/useGetLocalizedText';

const ChooseSubscription = (props: { state: State, dispatch: any, culture?: string }) => {
  useTrackComponent('ChooseSubscription', props);
  const { subState, plans, handleSelect, handleContinue } = useChooseSubscriptionLogic(props.state, props.dispatch);
  const culture = props.culture || "en-US";
  const localized = useGetLocalizedText(culture)?.ChooseSubscription || {
    title: 'Choose Your Subscription Plan',
    selected: 'Selected',
    continue: 'Continue',
    note: 'You can change or cancel your subscription at any time.'
  };
  if (!localized) return null;
  return (
    <div className="choose-subscription-page">
      <h1 className="choose-subscription-title">{localized.title}</h1>
      <div className="choose-subscription-options">
        {plans.map((plan, idx) => (
          <div
            key={plan.label}
            className={`choose-subscription-card${subState.selected === idx ? " selected" : ""}`}
            onClick={() => handleSelect(idx)}
          >
            <h2>{plan.label}</h2>
            <div className="choose-subscription-price">${plan.price}</div>
            <ul className="choose-subscription-features">
              {plan.features.map((feature: string) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {subState.selected === idx && <div className="choose-subscription-selected">{localized.selected}</div>}
          </div>
        ))}
      </div>
      <button
        className="app-btn"
        disabled={subState.selected === null}
        onClick={handleContinue}
      >
        {localized.continue}
      </button>
      <div className="choose-subscription-note">
        <strong>{localized.note}</strong>
      </div>
    </div>
  );
};

export default ChooseSubscription;
