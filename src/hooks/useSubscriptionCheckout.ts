import { subscriptionError } from 'constants/errors';
import { useMutation } from 'react-query';
import { SubscriptionAPI, StartCheckoutResponse } from '../services/subscription';
import { SubscriptionStateType } from '../states/subscription';

const useSubscriptionCheckout = () => useMutation<
  StartCheckoutResponse | { success: boolean },
  Error,
  SubscriptionStateType
>(
  async ({
    isSoleProp,
    shouldIncorporate,
    incorporationPlan,
    stateFeePlan,
    plan,
  }: SubscriptionStateType) => {
    // Validate state has value
    if (shouldIncorporate && !incorporationPlan) {
      // The incorporation plan is not in stripe
      throw new Error(subscriptionError.INCORPORATION_PLAN_NOT_CONFIGURED);
    } else if (plan === undefined) {
      // The plan does not exist in stripe
      // if no plan is selected plan is null
      throw new Error(subscriptionError.SUBSCRIPTION_NOT_CONFIGURED);
    } else if (!stateFeePlan) {
      // The state plan is not in stripe
      throw new Error(subscriptionError.STATE_FEE_PLAN_NOT_CONFIGURED);
    } else if (isSoleProp && !shouldIncorporate) {
      // If the customer is "Sole Prop" it has to incorporate
      throw new Error(subscriptionError.INCORPORATION_REQUIRED);
    } else if (!isSoleProp && !plan) {
      // If the customer is NOT "Sole Prop" it has to select a "Subscription Plan"
      throw new Error(subscriptionError.SUBSCRIPTION_PLAN_REQUIRE);
    } else if (shouldIncorporate === false && plan === null) {
      // Special condition where the user chose to not incorportate
      // and to opt-out of plan selection
      return { success: true };
    }

    try {
      return await SubscriptionAPI.StartCheckout({
        incorporationOrder: shouldIncorporate
          ? {
            referenceId: incorporationPlan!.checkoutReference,
            stateFeeReferenceId: stateFeePlan.checkoutReference,
          }
          : null,
        subscriptionOrder: plan
          ? {
            referenceId: plan.checkoutReference,
          }
          : null,
        successUrl: `${window.location.origin}/`,
        cancelUrl: `${window.location.origin}/subscription?success=false`,
      });
    } catch (checkoutErr) {
      throw new Error(checkoutErr.response?.data?.message);
    }
  },
);

export default useSubscriptionCheckout;
