import type { FC } from 'react';
import type { Dispatch } from 'react';
import { ChooseSubscription } from '../ChooseSubscription';
import { Checkout } from '../Checkout';
import type { Action } from '../../types/Action';
import type { State } from '../../types/State';

interface SubscribeProps {
    state: State;
    dispatch: Dispatch<Action>;
}

export const Subscribe: FC<SubscribeProps> = (props) => {
    const { state, dispatch } = props;
    const showCheckout = Boolean(state.selectedSubscriptionPlan);

    return (
        <div className="subscribe-page">
            <ChooseSubscription state={state} dispatch={dispatch} />
            {showCheckout && <Checkout state={state} dispatch={dispatch} />}
        </div>
    );
};

