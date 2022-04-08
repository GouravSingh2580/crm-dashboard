import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { CONFIG } from '../config';

type AppState = {
  returnTo?: string;
};

interface IAuth0ProviderWithHistory {
  children: React.ReactNode;
}

export const Auth0ProviderWithHistory = ({
  children,
}: IAuth0ProviderWithHistory) => {
  const history = useHistory();

  const onRedirectCallback = (appState: AppState) => {
    const route = appState?.returnTo || window.location.pathname;
    history.push(route);
  };

  return (
    <Auth0Provider
      domain={CONFIG.auth0Domain}
      clientId={CONFIG.auth0ClientId}
      redirectUri={window.location.origin}
      audience={CONFIG.auth0Audience}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
