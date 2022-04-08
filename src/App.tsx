import { injectFeatureFlagInit } from 'helpers/featureFlag';
import { withSentryIdentitySetup } from 'helpers/sentry';
import { Alerts } from './components/common';
import { LoadHubspotScript } from './components/LoadHubSpotScript';
import { Routing } from './Routing';

const AppBase = () => (
  <>
    <Routing />
    <Alerts />
    <LoadHubspotScript />
    {
      process.env.NODE_ENV === 'production' && <LoadHubspotScript />
    }
  </>
);

export const App = withSentryIdentitySetup(injectFeatureFlagInit(AppBase));
