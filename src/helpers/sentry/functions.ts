import * as Sentry from '@sentry/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { LogProps } from './types';

export const log = (props: LogProps) => {
  Sentry.addBreadcrumb(props);
};

export const logInfo = ({ category, message, data }: Omit<LogProps, 'level'>) => {
  Sentry.addBreadcrumb({
    category,
    message: `Info: ${message}`,
    data,
    level: Sentry.Severity.Info,
  });
};

export const logError = ({ category, message, data }: Omit<LogProps, 'level'>) => {
  Sentry.addBreadcrumb({
    category,
    data,
    message: `Error: ${message}`,
    level: Sentry.Severity.Error,
  });
};

export const useSentryUser = () => {
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    if (user != null && isAuthenticated) {
      Sentry.setUser({
        email: user.email,
      });
    }
  }, [user?.email, isAuthenticated]);
};
