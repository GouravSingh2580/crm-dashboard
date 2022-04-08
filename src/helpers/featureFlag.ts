import React from 'react';
import { CONFIG } from 'config';
import { withLDProvider } from 'launchdarkly-react-client-sdk';

export const ALLOWED_ENVIRONMENTS = ['production', 'staging01'];

export const injectFeatureFlagInit = (Component: React.FC) => {
  if (ALLOWED_ENVIRONMENTS.includes(CONFIG.environment)) {
    return withLDProvider({
      clientSideID: CONFIG.launchDarkly.clientId,
      user: {
        anonymous: true,
      },
    })(Component);
  }
  return Component;
};
