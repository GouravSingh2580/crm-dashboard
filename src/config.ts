// React app doesn't have a solution to updating configuration at deploy time.
/* The expectation is that the application will be rebuilt for that environment to allow for
variables interpolation. */
/* This logic is a workaround the limitation, backend URL and Auth0 config are inferred from
the windows.location.host */

export interface Config {
  apiUrl: string; // todo: For deprecation in the future
  apiBaseUrl: string;
  apiBookkeepingUrl: string;
  apiPayrollUrl: string;
  gustoClientId: string;
  gustoAuthUrl: string;
  gustoRedirectUri: string;
  auth0Domain: string;
  auth0ClientId: string;
  auth0Audience: string;
  logoutUrl: string;
  suggestLoginUser: boolean;
  showNavBar: boolean;
  stripeClientId: string;
  enableDocuments: boolean;
  datadog: {
    enabled: boolean;
    env: string;
    trackInteractions: boolean;
  };
  enablePlacesAutocomplete: boolean;
  googleAPIKey: string;
  sentry: {
    enabled: boolean;
    env: string;
  }
  environment: string;
  hubspotAccountId: string;
  launchDarkly: {
    clientId: string;
    SDKKey: string;
  }
  adobePDFPreviewKey: string
}

const configByEnv: Record<string, Partial<Config>> = {
  dev01: {
    auth0Domain: 'formations-test.us.auth0.com',
    auth0ClientId: 'xBr3ytTSgR3NMixZMLwLBYzpLOiORCN2',
    auth0Audience: 'https://dev01.api.formationscorp.com/',
    apiBookkeepingUrl: 'https://bookkeeping.dev.api.formationscorp.com',
    apiPayrollUrl: 'https://payroll.dev.api.formationscorp.com',
    gustoClientId: 'rDF1-gsvmNSZswY_aE2GweP6QLsPlELkLAVfSa8H6DM',
    gustoAuthUrl: 'https://app.gusto-demo.com/oauth/authorize',
    gustoRedirectUri: 'https://dev01.app.formationscorp.com/gusto/callback',
    logoutUrl: 'https://dev01.app.formationscorp.com/logout',
    suggestLoginUser: false,
    showNavBar: true,
    stripeClientId:
      'pk_test_51IQh45IJhNbHfeWHDKEWWuYdUl74G1cZLLHxRDws6Te7waIrQZrla0jAGFc6s8H4PAGQC3Q6VMgADTWJvq53QqLM00AMyEO0H3',
    enableDocuments: true,
    datadog: {
      enabled: true,
      env: 'dev01',
      trackInteractions: false,
    },
    enablePlacesAutocomplete: true,
    googleAPIKey: 'AIzaSyDNLVJn_Eg0L0e8TNZ7kaI1NIgoBkxdAtE',
    sentry: {
      enabled: true,
      env: 'development',
    },
    environment: 'dev01',
    hubspotAccountId: '19922506',
    launchDarkly: {
      clientId: '6177a09ec9dff82419892d28',
      SDKKey: 'sdk-2b4d88d1-365d-4b52-88dd-7b9afc38a96d',
    },
    adobePDFPreviewKey: '249c9eec454249499ea24fd698f0943e',
  },
  staging01: {
    auth0Domain: 'formations-test.us.auth0.com',
    auth0ClientId: 'NdtbMJYoJuYfzQo3wWsQ0TzdvuiOm8pB',
    auth0Audience: 'https://staging01.api.formationscorp.com/',
    apiBookkeepingUrl: 'https://bookkeeping.staging.api.formationscorp.com',
    apiPayrollUrl: 'https://payroll.staging.api.formationscorp.com',
    gustoClientId: 'rDF1-gsvmNSZswY_aE2GweP6QLsPlELkLAVfSa8H6DM',
    gustoAuthUrl: 'https://app.gusto-demo.com/oauth/authorize',
    gustoRedirectUri: 'https://staging01.app.formationscorp.com/gusto/callback',
    logoutUrl: 'https://staging01.app.formationscorp.com/logout',
    suggestLoginUser: false,
    showNavBar: true,
    stripeClientId:
      'pk_test_51IQh45IJhNbHfeWHDKEWWuYdUl74G1cZLLHxRDws6Te7waIrQZrla0jAGFc6s8H4PAGQC3Q6VMgADTWJvq53QqLM00AMyEO0H3',
    enableDocuments: true,
    datadog: {
      enabled: true,
      env: 'staging01',
      trackInteractions: true,
    },
    enablePlacesAutocomplete: true,
    googleAPIKey: 'AIzaSyANeWJoIEFTpcMOX5ZjCmsrrtZYSjuHGNM',
    sentry: {
      enabled: true,
      env: 'staging',
    },
    environment: 'staging01',
    hubspotAccountId: '19922506',
    launchDarkly: {
      clientId: '6177a09ec9dff82419892d28',
      SDKKey: 'sdk-2b4d88d1-365d-4b52-88dd-7b9afc38a96d',
    },
    adobePDFPreviewKey: '49c7c1eadb1e4983a153fedd4ad1e109',
  },
  production: {
    auth0Domain: 'formations.us.auth0.com',
    auth0ClientId: 'd3ueIJgo9ZlSjWC1KRskzyLL5Zsu64pl',
    auth0Audience: 'https://api.formationscorp.com/',
    apiBookkeepingUrl: 'https://bookkeeping.prod.api.formationscorp.com/',
    apiPayrollUrl: 'https://payroll.prod.api.formationscorp.com',
    gustoClientId: 'rDF1-gsvmNSZswY_aE2GweP6QLsPlELkLAVfSa8H6DM',
    gustoAuthUrl: 'https://app.gusto-demo.com/oauth/authorize',
    gustoRedirectUri: 'https://app.formationscorp.com/gusto/callback',
    logoutUrl: 'https://app.formationscorp.com/logout',
    suggestLoginUser: false,
    showNavBar: true,
    stripeClientId: 'pk_live_JMLiAZwHqCqpYFH5tuNwoDrw00TTvpaS40',
    enableDocuments: true,
    datadog: {
      enabled: true,
      env: 'production',
      trackInteractions: true,
    },
    enablePlacesAutocomplete: true,
    googleAPIKey: 'AIzaSyBat--YWPbwqNfF_Q01-t7Ux5N2DJORmeg',
    sentry: {
      enabled: true,
      env: 'production',
    },
    environment: 'production',
    hubspotAccountId: '6637631',
    launchDarkly: {
      clientId: '6177a09ec9dff82419892d29',
      SDKKey: 'sdk-4daae81d-dce3-41d2-924c-6b680c7027a7',
    },
    adobePDFPreviewKey: '79200d1af9024494982b48d0e2ec4282',
  },
};

const loadConfigFromUrl = (): Config => {
  const host = window.location.host.toLowerCase();
  if (host.startsWith('localhost')) {
    return {
      apiUrl: '',
      apiBaseUrl: '',
      apiBookkeepingUrl: 'https://bookkeeping.dev.api.formationscorp.com',
      apiPayrollUrl: 'http://localhost:4000/v1',
      gustoClientId: 'rDF1-gsvmNSZswY_aE2GweP6QLsPlELkLAVfSa8H6DM',
      gustoAuthUrl: 'https://app.gusto-demo.com/oauth/authorize',
      gustoRedirectUri: 'https://0675-2600-8806-206-dc00-2d60-dcb8-d0ef-4f83.ngrok.io/gusto/callback',
      auth0Domain: '',
      auth0ClientId: '',
      auth0Audience: '',
      logoutUrl: 'http://localhost:4040/logout',
      suggestLoginUser: true,
      showNavBar: true,
      stripeClientId:
        'pk_test_51IQh45IJhNbHfeWHDKEWWuYdUl74G1cZLLHxRDws6Te7waIrQZrla0jAGFc6s8H4PAGQC3Q6VMgADTWJvq53QqLM00AMyEO0H3',
      enableDocuments: true,
      datadog: {
        enabled: false,
        env: 'local',
        trackInteractions: false,
      },
      enablePlacesAutocomplete: true,
      googleAPIKey: '',
      sentry: {
        enabled: false,
        env: 'development',
      },
      environment: 'local',
      hubspotAccountId: '19922506',
      launchDarkly: {
        clientId: '6177a09ec9dff82419892d28',
        SDKKey: 'sdk-2b4d88d1-365d-4b52-88dd-7b9afc38a96d',
      },
      adobePDFPreviewKey: '04688e002ad44ed0bb3cc10d45277467',
    };
  }

  const subdomain = host.split('.')[0];
  const byEnv = subdomain === 'app'
    ? configByEnv.production
    : (configByEnv as any)[subdomain] || {};
  return {
    apiUrl: `https://${host.replace('app.', 'api.')}/api/v1/`,
    apiBaseUrl: `https://${host.replace('app.', 'api.')}`,
    ...byEnv,
  };
};

const load = (): Config => {
  const configFromUrl = loadConfigFromUrl();

  return {
    apiUrl: process.env.REACT_APP_SERVER_URL || configFromUrl.apiUrl,
    apiBaseUrl:
      process.env.REACT_APP_SERVER_BASE_URL || configFromUrl.apiBaseUrl,
    apiBookkeepingUrl:
      process.env.REACT_APP_BOOKKEEPING_SERVER_URL || configFromUrl.apiBookkeepingUrl,
    apiPayrollUrl:
      process.env.REACT_APP_PAYROLL_SERVER_URL || configFromUrl.apiPayrollUrl,
    gustoClientId: process.env.REACT_APP_GUSTO_CLIENT_ID || configFromUrl.gustoClientId,
    gustoAuthUrl: process.env.REACT_APP_GUSTO_AUTH_URL || configFromUrl.gustoAuthUrl,
    gustoRedirectUri: process.env.REACT_APP_GUSTO_REDIRECT_URI || configFromUrl.gustoRedirectUri,
    auth0Domain:
      process.env.REACT_APP_AUTH0_DOMAIN || configFromUrl.auth0Domain,
    auth0ClientId:
      process.env.REACT_APP_AUTH0_CLIENT_ID || configFromUrl.auth0ClientId,
    auth0Audience:
      process.env.REACT_APP_AUTH0_AUDIENCE || configFromUrl.auth0Audience,
    logoutUrl: process.env.REACT_APP_LOGOUT_URL || configFromUrl.logoutUrl,
    showNavBar: configFromUrl.showNavBar,
    suggestLoginUser: configFromUrl.suggestLoginUser,
    stripeClientId:
      process.env.REACT_APP_STRIPE_CLIENT_ID || configFromUrl.stripeClientId,
    enableDocuments: configFromUrl.enableDocuments,
    datadog: configFromUrl.datadog,
    enablePlacesAutocomplete: configFromUrl.enablePlacesAutocomplete,
    googleAPIKey:
      process.env.REACT_APP_GOOGLE_API_KEY
      || configFromUrl.googleAPIKey,
    sentry: {
      enabled: configFromUrl.sentry.enabled,
      env: process.env.REACT_APP_SENTRY_ENVIRONMENT || configFromUrl.sentry.env,
    },
    environment: configFromUrl.environment,
    hubspotAccountId: configFromUrl.hubspotAccountId,
    launchDarkly: configFromUrl.launchDarkly,
    adobePDFPreviewKey: configFromUrl.adobePDFPreviewKey,
  };
};

export const CONFIG: Config = load();
