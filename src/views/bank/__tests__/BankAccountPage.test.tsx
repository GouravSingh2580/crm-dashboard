import { render, screen, waitFor } from '@testing-library/react';
import { useCurrentUser } from 'hooks/api';
import { useAccessToken, useBankAccounts, usePlaidLinkToken } from 'hooks/api/useBankAccount';
import { usePlaidLink } from 'react-plaid-link';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import BankAccountPage from 'views/bank/BankAccountPage';
import { BankAccountSetup, BankAccountLoading, BankAccountView } from 'components/bookkeeping/bankAccountStages';

jest.mock('hooks/api', () => ({
  useCurrentUser: jest.fn(),
}));
jest.mock('hooks/api/useBankAccount', () => ({
  usePlaidLinkToken: jest.fn(),
  useBankAccounts: jest.fn(),
  useAccessToken: jest.fn(),
}));
jest.mock('react-plaid-link', () => ({
  usePlaidLink: jest.fn(),
}));
jest.mock('../../../components/bookkeeping', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/bookkeeping'),
  BankAccountsTable: () => (<div>this is a mocked bank accounts table</div>),
}));
jest.mock('launchdarkly-react-client-sdk', () => ({
  __esModule: true,
  useFlags: () => ({
    bookkeeping: true,
  }),
}));
jest.mock('components/bookkeeping/bankAccountStages', () => ({
  __esModule: true,
  ...jest.requireActual('components/bookkeeping/bankAccountStages'),
  BankAccountSetup: jest.fn(),
  BankAccountLoading: jest.fn(),
  BankAccountView: jest.fn(),
}));

const useCurrentUserMock = useCurrentUser as jest.Mock;
const usePlaidLinkTokenMock = usePlaidLinkToken as jest.Mock;
const useBankAccountsMock = useBankAccounts as jest.Mock;

const connectionsMock = {
  id: 'c2b90cf0-1fd3-11ec-8637-aa665a499f3d',
  account_id: '61268a98f3bb3878775c469f',
  name: 'Chase',
  item_id: 'L6pgrWAKWGhrq6RvyJJnfDvlRdjk3KtPvBnWE',
  last_fetch_date: '0000-12-31T15:47:32-08:12',
  created_by: '612686d0032e980069c6f357',
  created_at: '2021-09-27T13:44:50.717867-07:00',
  updated_at: '2021-09-27T13:44:50.717867-07:00',
  accounts: [{
    id: 'A6wqZeoAe5honMg8yVVrF1jb3zvWygu1GMv7m',
    connection_id: 'c2b90cf0-1fd3-11ec-8637-aa665a499f3d',
    name: 'Plaid Checking',
    type: 'depository',
    subtype: 'checking',
    is_connected: false,
    official_name: 'Plaid Gold Standard 0% Interest Checking',
    created_at: '2021-09-27T13:45:07.928222-07:00',
    updated_at: '2021-09-27T15:07:09.139502-07:00',
    account_id: '61268a98f3bb3878775c469f',
  }, {
    id: 'GAnjgpV9pbCDxpkjXmm9fNeWJjbArXu1Ew4lL',
    connection_id: 'c2b90cf0-1fd3-11ec-8637-aa665a499f3d',
    name: 'Plaid Saving',
    type: 'depository',
    subtype: 'savings',
    is_connected: false,
    official_name: 'Plaid Silver Standard 0.1% Interest Saving',
    created_at: '2021-09-27T13:45:07.938484-07:00',
    updated_at: '2021-09-27T15:07:09.148454-07:00',
    account_id: '61268a98f3bb3878775c469f',
  }],
};

describe('Bank account stage test', () => {
  const setup = () => {
    (BankAccountLoading as jest.Mock).mockReturnValue(<>show loading page</>);
    (BankAccountSetup as jest.Mock).mockReturnValue(<>show setup page</>);
    (BankAccountView as jest.Mock).mockReturnValue(<>show account page</>);
    useCurrentUserMock.mockReturnValue({
      data: { accountId: '123', name: { first: 'Test', last: 'Last' } },
      isLoading: false,
    });
  };
  it('should render setup page', async () => {
    setup();
    useBankAccountsMock.mockReturnValue({
      connections: [],
      isLoading: false,
      error: null,
    });

    render(wrapThemeProvider(<BankAccountPage />));
    await waitFor(() => screen.findByText('show setup page'));
    expect(screen.getByText('show setup page')).toBeTruthy();
  });
  it('should render loading page', async () => {
    setup();
    useBankAccountsMock.mockReturnValue({
      connections: [],
      isLoading: true,
      error: null,
    });

    render(wrapThemeProvider(<BankAccountPage />));
    await waitFor(() => screen.findByText('show loading page'));
    expect(screen.getByText('show loading page')).toBeTruthy();
  });

  it('should render account view', async () => {
    setup();
    useBankAccountsMock.mockReturnValue({
      connections: [connectionsMock],
      isLoading: false,
      error: null,
    });

    render(wrapThemeProvider(<BankAccountPage />));
    await waitFor(() => screen.findByText('show account page'));
    expect(screen.getByText('show account page')).toBeTruthy();
  });
});

describe('bank account test', () => {
  describe.skip('get plaid link error test', () => {
    it('should show error alert', async () => {
      useCurrentUserMock.mockReturnValue({
        data: { accountId: undefined },
        isLoading: false,
      });
      usePlaidLinkTokenMock.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('custom error'),
      });
      useBankAccountsMock.mockReturnValue({
        connections: [],
        error: null,
      });
      render(wrapThemeProvider(<BankAccountPage />));
      await waitFor(() => screen.findByText('Bank Accounts'));
      const element = await screen.findByRole('alert');
      expect(element).toHaveTextContent('Error');
    });
  });

  describe.skip('connection button test', () => {
    const mockSetup = () => {
      (useAccessToken as jest.Mock).mockReturnValue({ setAccessToken: jest.fn() });
      (usePlaidLink as jest.Mock).mockReturnValue({ open: jest.fn(), ready: true });
      useCurrentUserMock.mockReturnValue({
        data: { accountId: '123' },
        isLoading: false,
      });
      usePlaidLinkTokenMock.mockReturnValue({
        data: 'plaid_token',
        isLoading: false,
        isError: false,
        error: null,
      });
    };

    it('should enable connection button', () => {
      mockSetup();
      useBankAccountsMock.mockReturnValue({
        connections: [],
        error: null,
      });
      const { getByTestId } = render(wrapThemeProvider(<BankAccountPage />));
      const button = getByTestId('connectButton');
      expect(button).toBeTruthy();
      expect(button).toBeEnabled();
    });

    it('should disable connection button', () => {
      mockSetup();
      useBankAccountsMock.mockReturnValue({
        connections: [connectionsMock],
        error: null,
      });
      const { getByTestId } = render(wrapThemeProvider(<BankAccountPage />));
      const button = getByTestId('connectButton');
      expect(button).toBeTruthy();
      expect(button).toBeDisabled();
    });
  });
});
