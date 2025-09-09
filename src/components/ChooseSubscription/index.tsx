
import { useChooseSubscriptionLogic } from '../../hooks/useChooseSubscription';
import type { State } from '../../types/State';
import "./ChooseSubscription.css";

const ChooseSubscription = (props: { state: State, dispatch: any }) => {
  const { subState, plans, handleSelect, handleContinue } = useChooseSubscriptionLogic(props.state, props.dispatch);
  return (
    <div className="choose-subscription-page">
      <h1 className="choose-subscription-title">Choose Your Subscription</h1>
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
            {subState.selected === idx && <div className="choose-subscription-selected">Selected</div>}
          </div>
        ))}
      </div>
      <button
        className="app-btn"
        disabled={subState.selected === null}
        onClick={handleContinue}
      >
        Continue to Checkout
      </button>
      <div className="choose-subscription-note">
        <strong>All plans include image hosting for up to 20 images.</strong>
      </div>
    </div>
  );
};

export default ChooseSubscription;
