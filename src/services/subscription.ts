import Api from './axios';

export interface StartCheckoutResponse {
  sessionId: string;
}

export interface SubscriptionCheckoutArgs {
  incorporationOrder: {
    referenceId: string;
    stateFeeReferenceId: string;
  } | null;
  subscriptionOrder: {
    referenceId: string;
  } | null;
  successUrl: string;
  cancelUrl: string;
}

export interface Plan {
  id: string;
  checkoutReference: string;
  name: string;
  description: string;
  price: string;
}

export interface SubscriptionStatus {
  status: 'active' | 'none';
  id: string;
  planId: string;
  planName: string;
  planDescription: string;
  price: {
    amount: number;
    currency: string;
  };
}

const ListPlans = async (): Promise<Plan[]> => {
  const { data } = await Api.get<{ data: Plan[] }>('subscription/plans');
  return data.data;
};

const GetStateFee = async (stateCode: string): Promise<Plan> => {
  const { data } = await Api.get<{ data: Plan }>(
    `subscription/state-fees/${stateCode}`,
  );
  return data.data;
};

const GetStatus = async (): Promise<SubscriptionStatus> => {
  const { data } = await Api.get<{ data: SubscriptionStatus }>(
    'subscription/status',
  );
  return data.data;
};

const StartCheckout = async (
  args: SubscriptionCheckoutArgs,
): Promise<StartCheckoutResponse> => {
  const { data } = await Api.post<
    SubscriptionCheckoutArgs,
    { data: { data: StartCheckoutResponse } }
  >('subscription/checkout', args);
  return data.data;
};

export const SubscriptionAPI = {
  ListPlans,
  GetStateFee,
  GetStatus,
  StartCheckout,
};
