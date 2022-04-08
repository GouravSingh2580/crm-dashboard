import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaxLiability } from './TaxLiability';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { getPrettyDateTime } from 'helpers/dateTimeFormat';
import { useAccountByUserId, useUpdateAccount } from 'hooks/api';
import { MemoryRouter, Route } from 'react-router-dom';
import { IAccount } from 'models/account';

jest.mock('hooks/api', () => ({
  useAccountByUserId: jest.fn(),
  useUpdateAccount: jest.fn(),
}));

const mockUpdateAccount = jest.fn().mockResolvedValue(null);

type TProps = {
  account: Partial<IAccount>;
};

const setup = ({ account }: TProps) => {
  (useAccountByUserId as jest.Mock).mockReturnValue({ account });
  (useUpdateAccount as jest.Mock).mockImplementation(() => ({
    mutateAsync: mockUpdateAccount,
  }));

  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <MemoryRouter initialEntries={[`/${account.id}`]}>
          <Route path={'/:id'}>
            <TaxLiability />
          </Route>
        </MemoryRouter>,
      ),
    ),
  );

  return {
    ...utils,
  };
};

test('Should render Estimated Annual Tax Liability as N/A', async () => {
  setup({
    account: {
      id: '123',
    },
  });

  expect(screen.getByTestId('title')).toBeInTheDocument();
  expect(
    screen.getByText(/Setup Estimated Total Liability/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Estimated Annual Tax Liability/),
  ).toBeInTheDocument();
  expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
  expect(
    screen.getByText('N/A'),
  ).toBeInTheDocument();
});

test('Should render Estimated Annual Tax Liability with default value', async () => {
  const updatedAt = Date();
  setup({
    account: {
      id: '124',
      taxes: {
        annualEstimated: 10000,
        updatedAt: '' + updatedAt,
      },
    },
  });

  const expectedLabel = `Estimated Annual Tax Liability — last update: ${getPrettyDateTime(
    updatedAt,
    'MMM D, YYYY',
  )}`;

  expect(await screen.findByText(expectedLabel)).toBeInTheDocument();
  expect(screen.getByText('10000')).toBeInTheDocument();
});

test('Should validate Estimated Annual Tax Amount', async () => {
  setup({
    account: {
      id: '125',
    },
  });

  act(() => {
    userEvent.click(screen.getByTestId('edit-btn'));
  });
  expect(screen.getByLabelText(/Estimated Annual Tax Liability/)).toHaveFocus();
  expect(screen.getByLabelText(/Estimated Annual Tax Liability/)).toHaveValue(
    '',
  );

  userEvent.type(
    screen.getByLabelText(/Estimated Annual Tax Liability/),
    '1000000',
  );

  userEvent.click(screen.getByTestId('form-save-btn'));

  expect(
    await screen.findByText(
      /Amount must be greater than 0 and less than 1000000./,
    ),
  ).toBeDefined();

  userEvent.type(
    screen.getByLabelText(/Estimated Annual Tax Liability/),
    '-1',
  );

  expect(
    await screen.findByText(
      /Amount must be greater than 0 and less than 1000000./,
    ),
  ).toBeDefined();
});

test('Should update Estimated Annual Tax Liability successfully', async () => {
  setup({
    account: {
      id: '125',
    },
  });

  act(() => {
    userEvent.click(screen.getByTestId('edit-btn'));
  });
  expect(screen.getByLabelText(/Estimated Annual Tax Liability/)).toHaveFocus();
  expect(screen.getByLabelText(/Estimated Annual Tax Liability/)).toHaveValue(
    '',
  );

  userEvent.type(
    screen.getByLabelText(/Estimated Annual Tax Liability/),
    '1234',
  );

  await waitFor(() => {
    userEvent.click(screen.getByTestId('form-save-btn'));
  });

  expect(mockUpdateAccount).toHaveBeenCalledWith({
    taxes: {
      annualEstimated: 1234
    }
  });
});
