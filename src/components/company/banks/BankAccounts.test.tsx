import React from 'react';
import { render } from '@testing-library/react';
import { useBankAccounts } from 'hooks/api/useBankAccount';
import { useFeatureFlag } from 'hooks/useFeatureFlag';
import { BankAccounts } from './BankAccounts';

jest.mock('hooks/useFeatureFlag', () => ({
  __esModule: true,
  default: jest.fn(),
  FLAGS: {
    BOOKKEEPING: 'bookkeeping',
  },
  useFeatureFlag: jest.fn(),
  withFeatureFlag: () => (Component: React.ComponentType) => (props: any) =>
    <Component {...props} />,
}));
jest.mock('hooks/api/useBankAccount');
jest.mock('components/toast/showToast');
jest.mock('components/bookkeeping', () => ({
  BankAccountsTable: () => <div />,
}));

describe('BankAccounts test', () => {
  it.skip('should render empty', () => {
    (useFeatureFlag as jest.Mock).mockReturnValue(true);
    (useBankAccounts as jest.Mock).mockReturnValue({
      connections: [],
      isLoading: false,
      error: null,
    });
    const { getAllByText } = render(<BankAccounts accountId="1" />);
    expect(getAllByText(/No bank is connected at the momment/)).toBeTruthy();
  });

  it('should render error', () => {
    (useFeatureFlag as jest.Mock).mockReturnValue(true);
    (useBankAccounts as jest.Mock).mockReturnValue({
      connections: [],
      isLoading: false,
      error: new Error('Custom error'),
    });
    const { getAllByText } = render(<BankAccounts accountId="1" />);
    expect(getAllByText(/An error has been occurred/)).toBeTruthy();
  });
});
