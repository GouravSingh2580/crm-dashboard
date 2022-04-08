import React, { useEffect } from 'react';
import {
  useFlags as useFlagsOrigin,
  useLDClient,
} from 'launchdarkly-react-client-sdk';
import { useCurrentUser } from 'hooks/api';
import { NotFoundPage } from 'views/NotFoundPage';
import { CONFIG } from 'config';
import { ALLOWED_ENVIRONMENTS } from 'helpers/featureFlag';

export const FLAGS = {
  BOOKKEEPING: 'bookkeeping',
  ADMIN_PROGRESS_TRACKER: 'AdminProgressTracker',
  XERO_CONNECTION: 'XeroConnection',
  INSIGHT: 'insight',
  BETA: 'beta',
};

export const useFlags = () => {
  const flags = useFlagsOrigin();
  if (ALLOWED_ENVIRONMENTS.includes(CONFIG.environment)) {
    return flags;
  }
  return {
    beta: false, // beta features will be false by default
    bookkeeping: true,
  };
};

export const useFeatureFlag = (key: string): boolean => {
  const flags = useFlags();
  if (
    ALLOWED_ENVIRONMENTS.includes(CONFIG.environment) &&
    CONFIG.sentry.enabled
  ) {
    return flags[key] === true;
  }
  return true;
};

export const applyFeatureFlag = (key: string, component: React.ReactNode) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isFeatureFlagEnabled = useFeatureFlag(key);
  if (isFeatureFlagEnabled) return component;
  return null;
};

// eslint-disable-next-line max-len
export const withFeatureFlag =
  (key: string, DefaultComponent: React.ComponentType | null = NotFoundPage) =>
  <P extends unknown>(WrappedComponent: React.ComponentType<P>) =>
  (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isFeatureFlagEnabled = useFeatureFlag(key);
    if (isFeatureFlagEnabled) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <WrappedComponent {...props} />;
    }
    return DefaultComponent == null ? null : <DefaultComponent />;
  };

export const useFeatureFlagIdentify = () => {
  const LDClient = useLDClient();
  const { currentUser, isSuccess } = useCurrentUser();

  useEffect(() => {
    if (LDClient && currentUser && isSuccess) {
      LDClient.identify({
        key: currentUser.id,
        email: currentUser.email,
        firstName: currentUser?.name?.first,
        lastName: currentUser?.name?.last,
      })
        .catch((e) => {
          console.log(JSON.stringify(e));
        });
    }
  }, [currentUser, LDClient]);
};
