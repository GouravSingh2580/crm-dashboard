import useSubscriptions from '../useSubscriptions';

describe('useSubscriptions test', () => {
  it('should have GetSubscriptionStatus', () => {
    expect(useSubscriptions.GetSubscriptionStatus).toBeInstanceOf(Function);
  });
});
