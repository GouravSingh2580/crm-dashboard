import { render, fireEvent } from '@testing-library/react';
import { useCurrentUser } from 'hooks/api';
import { useTransactionUpdate } from 'hooks/api/useBankTransactions';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { SortingDirection } from 'enums';
import {
  BankTransactionsTable,
  TransactionItem,
} from '../BankTransactionsTable/BankTransactionsTable';
import { categories, transactions } from './data.mock';

jest.mock('hooks/api', () => ({
  __esModule: true,
  useCurrentUser: jest.fn(),
}));
jest.mock('hooks/api/useBankTransactions', () => ({
  __esModule: true,
  useTransactionUpdate: jest.fn(),
}));

describe('bank transaction table test', () => {
  const sampleData: TransactionItem[] = transactions;
  const onPageChange = jest.fn();
  const onSortingChange = jest.fn();
  const refresh = jest.fn();

  it('show empty state', () => {
    (useCurrentUser as jest.Mock).mockReturnValue({
      data: { accountId: '123' },
    });
    (useTransactionUpdate as jest.Mock).mockImplementation(() => ({
      updateTransaction: jest.fn(),
    }));
    const { queryByText } = render(
      wrapThemeProvider(
        <BankTransactionsTable
          data={[]}
          numberOfPages={1}
          categories={categories}
          page={1}
          sorting={{
            direction: SortingDirection.Asc,
            name: 'date',
          }}
          onPageChange={onPageChange}
          onSortingChange={onSortingChange}
          refresh={refresh}
        />,
      ),
    );

    expect(queryByText(/No transactions available/)).toBeTruthy();
  });

  it('show table', () => {
    (useCurrentUser as jest.Mock).mockReturnValue({
      data: { accountId: '123' },
    });
    (useTransactionUpdate as jest.Mock).mockImplementation(() => ({
      updateTransaction: jest.fn(),
    }));
    const { queryAllByText } = render(
      wrapThemeProvider(
        <BankTransactionsTable
          data={sampleData}
          numberOfPages={1}
          categories={categories}
          page={1}
          sorting={{
            direction: SortingDirection.Asc,
            name: 'date',
          }}
          onPageChange={onPageChange}
          onSortingChange={onSortingChange}
          refresh={refresh}
        />,
      ),
    );
    expect(queryAllByText(/AUTOMATIC PAYMENT - THANK/)).toBeTruthy();
    expect(queryAllByText(/AUTOMATIC PAYMENT - THANK/)).toHaveLength(3);
  });

  it('paginate test', async () => {
    (useCurrentUser as jest.Mock).mockReturnValue({
      data: { accountId: '123' },
    });
    (useTransactionUpdate as jest.Mock).mockImplementation(() => ({
      updateTransaction: jest.fn(),
    }));
    const { container } = render(
      wrapThemeProvider(
        <BankTransactionsTable
          data={sampleData}
          categories={categories}
          numberOfPages={2}
          page={1}
          sorting={{
            direction: SortingDirection.Asc,
            name: 'date',
          }}
          onPageChange={onPageChange}
          onSortingChange={onSortingChange}
          refresh={refresh}
        />,
      ),
    );
    const button = container.querySelector('[aria-label="Go to page 2"]');
    if (button) {
      fireEvent.click(button);
    }
    expect(onPageChange).toBeCalled();
  });
});
