import { useQuery } from 'react-query';
import { SubscriptionAPI, SubscriptionStatus } from '../../services/subscription';

const useSubscription = {
  GetSubscriptionStatus: () => useQuery<SubscriptionStatus, unknown>(
    ['currentUser', 'subscriptionstatus'],
    () => SubscriptionAPI.GetStatus(),
  ),
};

export default useSubscription;
