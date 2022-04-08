import * as Sentry from '@sentry/react';

export enum Category {
  OnBoarding = 'OnBoarding',
  Auth = 'Auth',
  Bookkeeping = 'Bookkeeping',
  Document = 'Document',
  Service = 'Service',
}

export interface LogProps {
  category: Category | undefined;
  message: string;
  data?: any;
  level: Sentry.Severity;
}
