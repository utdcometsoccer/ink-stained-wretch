import type { FC } from 'react';
import { useChooseSubscriptionLogic } from '../../hooks/useChooseSubscription';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import type { ChooseCultureProps } from '../ChooseCulture/ChooseCultureProps';
import "./ChooseSubscription.css";
import { fallbackPlans } from './fallbackPlans';

export const ChooseSubscription: FC<ChooseCultureProps> = (props) => {
  useTrackComponent('ChooseSubscription', { hasState: !!props.state, hasCulture: !!props.culture });
  const { subState, handleSelect } = useChooseSubscriptionLogic(props.state, props.dispatch);
  const localized = useLocalizationContext().ChooseSubscription;
  const { state } = props;
  const { subscriptionPlans } = state;
  const plans = subscriptionPlans || fallbackPlans;
  return (
    <div>
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
            {Array.isArray(plan.features) && plan.features.length > 0 && (
              <ul className="choose-subscription-features">
                {plan.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            )}
            {subState.selected === idx && <div className="choose-subscription-selected">{localized.selected}</div>}
          </div>
        ))}
      </div>
      <div className="choose-subscription-note">
        <strong>{localized.note}</strong>
      </div>
    </div>
  );
}