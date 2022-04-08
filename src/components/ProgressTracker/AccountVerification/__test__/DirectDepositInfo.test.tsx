import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectDepositInfo } from '../DirectDepositInfo';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { ProgressTrackerStatus } from 'models/account';

import { useCurrentUser, useUpdateUser } from 'hooks/api';

jest.mock('hooks/api', () => ({
  useCurrentUser: jest.fn(),
  useUpdateUser: jest.fn(),
}));

const mockUpdateUser = jest.fn().mockResolvedValue(null);

const setup = ({
  handleContinue = jest.fn(),
  userData = {
    id: '123',
  },
  status = ProgressTrackerStatus.Unknown,
}) => {
  (useCurrentUser as jest.Mock).mockReturnValue({
    currentUser: userData,
    isFetching: false,
  });
  (useUpdateUser as jest.Mock).mockImplementation(() => ({
    updateUserAsync: mockUpdateUser,
  }));
  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <DirectDepositInfo
          handleContinue={handleContinue}
          currentStatus={status}
        />,
      ),
    ),
  );
  return {
    ...utils,
  };
};

test('should render Direct Deposit Information without data', async () => {
  setup({});
  expect(
    screen.getByText(/Direct Deposit \(Personal Bank Account\)/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Enter your personal banking information so we can setup payroll from your business to your personal bank account./,
    ),
  ).toBeInTheDocument();
  expect(screen.queryAllByDisplayValue('')).toHaveLength(4);
  expect(screen.getByTestId(/save-direct-deposit/)).toBeInTheDocument();
});

test('should render Direct Deposit Information with correct data', async () => {
  const userData = {
    id: '123',
    bankName: 'ABC',
    routingNumber: '123456789',
    bankAccountNumber: '9876543210',
    bankAccountType: 'savings',
  };

  setup({
    userData,
    status: ProgressTrackerStatus.Completed,
  });

  expect(
    screen.getByText(/Direct Deposit \(Personal Bank Account\)/),
  ).toBeInTheDocument();
  expect(screen.getByText(/All good\!/)).toBeInTheDocument();
  expect(screen.getByText(/ABC/)).toBeInTheDocument();
  expect(screen.getByText(/123456789/)).toBeInTheDocument();
  expect(screen.getByText(/9876543210/)).toBeInTheDocument();
  expect(screen.getByText(/savings/)).toBeInTheDocument();
  expect(screen.queryByTestId(/save-direct-deposit/)).not.toBeInTheDocument();
});

test('should validate Direct Deposit form', async () => {
  setup({});
  expect(
    screen.getByText(/Direct Deposit \(Personal Bank Account\)/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Enter your personal banking information so we can setup payroll from your business to your personal bank account./,
    ),
  ).toBeInTheDocument();
  expect(screen.queryAllByDisplayValue('')).toHaveLength(4);
  act(() => {
    userEvent.click(screen.getByTestId(/save-direct-deposit/));
  });
  expect(
    await screen.findByText(/Please enter a bank name./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Routing number should be 9 digits./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Please enter an account number./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Please enter an account type./),
  ).toBeInTheDocument();
});

test('should save Direct Deposit Information correctly', () => {
  setup({});
  act(() => {
    userEvent.type(screen.getByLabelText(/Bank Name/), 'xyz');
    userEvent.type(screen.getByLabelText(/Routing Number/), '123456789');
    userEvent.type(screen.getByLabelText(/Account Number/), '9876543210');
    const accountType = screen.getByLabelText(/Account Type/);
    (accountType as HTMLSelectElement).value = 'checking';
    fireEvent.change(accountType);
  });
  setTimeout(() => {
    expect(mockUpdateUser).toHaveBeenCalledWith({
      bankName: 'XYZ',
      routingNumber: '123456789',
      bankAccountNumber: '9876543210',
      bankAccountType: 'savings',
    });
  });
});
