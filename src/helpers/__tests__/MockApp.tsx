import { PropsWithChildren } from 'react';
import { QueryWrapper } from 'hooks/api/__testMock__/TestComponent';
import { MockTheme } from './mockTheme';

export const AppMock = ({ children }: PropsWithChildren<{}>) => (
  <QueryWrapper>
    <MockTheme>{children}</MockTheme>
  </QueryWrapper>
);
