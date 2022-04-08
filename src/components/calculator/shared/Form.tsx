import { ReactNode } from 'react';

type TProps = {
  children: ReactNode[];
  [key: string]: unknown;
};

export const Form = ({ children, ...props }: TProps) => (
  <form noValidate {...props}>
    {children}
  </form>
);
