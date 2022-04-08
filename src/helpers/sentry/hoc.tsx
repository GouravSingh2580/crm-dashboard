import React from 'react';
import { useSentryUser } from './functions';

// eslint-disable-next-line max-len
export const withSentryIdentitySetup = <P extends {}>(Company: React.ComponentType<P>): React.FC<P> => function WithSentryIdentitySetup(props: P) {
  useSentryUser();
  return <Company {...props} />;
};
