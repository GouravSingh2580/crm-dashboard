import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { QueryClientProvider } from 'react-query';

import { CONFIG } from 'config';
import { datadogRum } from '@datadog/browser-rum';
import queryClient from 'states/reactQueryClient';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { LocalizationProvider } from '@mui/lab';
import { ErrorFallback } from 'components/common/ErrorFallback';
import { theme } from 'theme';
import { Auth0ProviderWithHistory } from 'auth/Auth0ProviderWithHistory';
import { App } from './App';

import './index.css';

if (CONFIG.datadog.enabled) {
  datadogRum.init({
    applicationId: 'ede1e7b6-61e5-4177-9482-a657ffb9f957',
    clientToken: 'pubdd08d432086310436324c3642f7dbda7',
    service: 'frontend',
    env: CONFIG.datadog.env,
    site: 'datadoghq.com',
    sampleRate: 100,
    trackInteractions: CONFIG.datadog.trackInteractions,
  });
}

if (
  ['development', 'staging', 'production'].includes(CONFIG.sentry.env) &&
  CONFIG.sentry.enabled
) {
  Sentry.init({
    dsn: 'https://7d6fd1913d1e434482526374615af779@o509044.ingest.sentry.io/5602647',
    integrations: [new Integrations.BrowserTracing()],
    environment: CONFIG.sentry.env,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <Router>
    <Auth0ProviderWithHistory>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StyledEngineProvider injectFirst>
              <Sentry.ErrorBoundary fallback={ErrorFallback}>
                <App />
              </Sentry.ErrorBoundary>
            </StyledEngineProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0ProviderWithHistory>
  </Router>,
  document.getElementById('root'),
);
