import { getTransactions } from 'services/bankTransactions';
import {
  render, waitFor,
} from '@testing-library/react';
import BankTransactions from 'views/bank/BankTransactions';
import createQueryWrapper, { mockedQueryClient } from 'hooks/api/__testMock__/TestComponent';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';

jest.mock('services/bankTransactions', () => ({ getTransactions: jest.fn() }));
jest.mock('components/bookkeeping/BankTransactionsTable', () => () => (<div>example transaction table</div>));
jest.mock('hooks/api/useUser');
jest.mock('hooks/api');

describe('Bank transactions page test', () => {
  const Wrapper = createQueryWrapper();

  beforeEach(() => {
    mockedQueryClient.resetQueries();
    jest.spyOn(console, 'error').mockImplementation(() => { /** do nothing */ });
  });

  it.skip('show error state', async () => {
    (getTransactions as jest.Mock).mockRejectedValue(new Error('example error'));
    const { queryByText } = render(
      wrapThemeProvider(
        <Wrapper>
          <BankTransactions />
        </Wrapper>,
      ),
    );
    await waitFor(() => expect(queryByText(/example error/)).toBeTruthy());
  });
});
