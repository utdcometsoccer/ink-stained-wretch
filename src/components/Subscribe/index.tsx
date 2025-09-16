import type { FC } from 'react';
import { ChooseSubscription } from '../ChooseSubscription';
import { Checkout } from '../Checkout';
import type { CheckoutProps } from '../Checkout/CheckoutProps';
import type { ChooseCultureProps } from '../ChooseCulture/ChooseCultureProps';
interface SubscribeProps extends ChooseCultureProps, CheckoutProps {
    // Combines props for both ChooseSubscription and Checkout
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

