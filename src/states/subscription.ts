import { createState } from '@hookstate/core';
import { Plan } from '../services/subscription';

export type SubscriptionStateType = {
  shouldIncorporate: boolean | null;
  isSoleProp: boolean | null;
  incorporationPlan: Plan | null;
  stateFeePlan: Plan | null;
  plan: Plan | null | undefined;
};

export const SubscriptionState = createState<SubscriptionStateType>({
  shouldIncorporate: null,
  isSoleProp: null,
  incorporationPlan: null,
  stateFeePlan: null,
  plan: null,
});
