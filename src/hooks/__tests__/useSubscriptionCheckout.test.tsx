import { act, renderHook } from '@testing-library/react-hooks';
import { subscriptionError } from 'constants/errors';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSubscriptionCheckout from '../useSubscriptionCheckout';

describe('useSubscriptionCheckout test', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  const mockedPlan = {
    id: '123',
    checkoutReference: '456',
    name: 'sample plan',
    description: 'sample desc',
    price: '415',
  };
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  it('Incorporation plan is not configured', async () => {
    const { result, waitFor } = renderHook(() => useSubscriptionCheckout(), { wrapper });
    await act(async () => {
      try {
        await result.current.mutateAsync({
          isSoleProp: true,
          shouldIncorporate: true,
          incorporationPlan: null,
          stateFeePlan: null,
          plan: null,
        });
      } catch {
        // ...
      }
    });
    waitFor(() => result.current.isError);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error).toHaveProperty('message', subscriptionError.INCORPORATION_PLAN_NOT_CONFIGURED);
  });

  it('throw error That subscription plan is not configured', async () => {
    const { result } = renderHook(() => useSubscriptionCheckout(), { wrapper });
    await act(async () => {
      await result.current.mutate({
        isSoleProp: true,
        shouldIncorporate: true,
        incorporationPlan: mockedPlan,
        stateFeePlan: null,
        plan: undefined,
      });
    });
    expect(result.current.error)
      .toStrictEqual(new Error(subscriptionError.SUBSCRIPTION_NOT_CONFIGURED));
  });

  it('throw error The state fee plan is not configured', async () => {
    const { result } = renderHook(() => useSubscriptionCheckout(), { wrapper });
    await act(async () => {
      await result.current.mutate({
        isSoleProp: true,
        shouldIncorporate: true,
        incorporationPlan: mockedPlan,
        stateFeePlan: null,
        plan: mockedPlan,
      });
    });
    expect(result.current.error)
      .toStrictEqual(new Error(subscriptionError.STATE_FEE_PLAN_NOT_CONFIGURED));
  });

  it('throw error Choose an option of incorporation', async () => {
    const { result } = renderHook(() => useSubscriptionCheckout(), { wrapper });
    await act(async () => {
      await result.current.mutate({
        isSoleProp: true,
        shouldIncorporate: false,
        incorporationPlan: mockedPlan,
        stateFeePlan: mockedPlan,
        plan: mockedPlan,
      });
    });
    expect(result.current.error)
      .toStrictEqual(new Error(subscriptionError.INCORPORATION_REQUIRED));
  });

  it('throw error Choose a subscription plan', async () => {
    const { result } = renderHook(() => useSubscriptionCheckout(), { wrapper });
    await act(async () => {
      await result.current.mutate({
        isSoleProp: false,
        shouldIncorporate: false,
        incorporationPlan: mockedPlan,
        stateFeePlan: mockedPlan,
        plan: null,
      });
    });
    expect(result.current.error)
      .toStrictEqual(new Error(subscriptionError.SUBSCRIPTION_PLAN_REQUIRE));
  });
});
