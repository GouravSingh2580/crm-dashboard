import React, { useMemo } from 'react';
import { Route } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Loading } from '../components/common';

export const ProtectedRoute = ({ component, ...args }: { component: React.FC }) => {
  const { isAuthenticated } = useAuth0();
  // Use memo to save the protected component as withAuthenticationRequired
  // will generate a new component whenever the url changes
  // It also affect the performance
  const NewComponent = useMemo(() => ((window as any).Cypress
    ? component
    : withAuthenticationRequired(component, {
      onRedirecting: Loading,
    })), [component, isAuthenticated]);

  return (
    <Route
      component={NewComponent}
      {...args}
    />
  );
};
