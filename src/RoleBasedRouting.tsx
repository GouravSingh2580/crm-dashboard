import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ProtectedRoute } from 'auth/ProtectedRoute';
import useTermsAndConditionsConsent from './hooks/useTermsAndConditionsConsent';
import { AuthService } from './services';
import { Routes } from './fnRoutes';

interface IRoleBasedRouting {
  role: string;
  component: React.FC;
  isProtected?: boolean;
  isEnabled?: boolean;
  path: string;
  exact?: boolean;
}

export const RoleBasedRouting = ({
  role,
  component: Component,
  isProtected = true,
  isEnabled = true,
  path,
  ...rest
}: IRoleBasedRouting) => {
  const userRole = AuthService.userRole();

  const { acceptedLatestTerms } = useTermsAndConditionsConsent();

  if (!userRole) {
    return <Redirect to={Routes.LOGIN} />;
  }
  if (!isEnabled || role.toLowerCase() !== userRole.toLowerCase()) {
    return <Redirect to={Routes.HOME()} />;
  }

  if (path === '/terms' && (!AuthService.isCustomer() || acceptedLatestTerms)) {
    return <Redirect to={Routes.HOME()} />;
  }

  if (
    path !== '/terms' &&
    AuthService.isCustomer() &&
    acceptedLatestTerms === false
  ) {
    return <Redirect to={Routes.TERMS_CONDITIONS} />;
  }

  return isProtected ? (
    // @ts-ignore
    <ProtectedRoute {...rest} path={path} component={Component} />
  ) : (
    <Route {...rest} path={path} component={Component} />
  );
};
