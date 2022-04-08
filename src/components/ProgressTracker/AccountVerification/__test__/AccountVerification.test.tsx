import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { ENTITY_MAPPING } from 'constants/common';
import {
  useCurrentCompany,
  useCurrentAccount,
  useUpdateAccountProgress,
} from 'hooks/api';
import { AccountVerificationComponent } from '../AccountVerificationComponent';

jest.mock('hooks/api', () => ({
  useCurrentCompany: jest.fn(),
  useCurrentAccount: jest.fn(),
  useUpdateAccountProgress: jest.fn(),
}));

const setup = ({ entityType = ENTITY_MAPPING.sole_prop }) => {
  const currentCompany = {
    accountId: '123',
    id: '123',
    entityType,
  };
  (useCurrentCompany as jest.Mock).mockReturnValue({
    currentCompany,
    isLoading: false,
    status: 'success',
  });

  (useCurrentAccount as jest.Mock).mockReturnValue({
    currentAccount: { id: '123', progress: [], entityType },
    isLoading: false,
    status: 'success',
    refetch: jest.fn(),
  });

  render(
    warpQueryClientProvider(
      wrapThemeProvider(<AccountVerificationComponent />),
    ),
  );
};

describe('Account Verfication Stage', () => {
  beforeEach(() => {
    (useUpdateAccountProgress as jest.Mock).mockImplementation(() => ({
      mutateAsync: jest.fn(),
    }));
  });
  test('should render account verifcation with 3 steps as Sole-Prop', async () => {
    setup({});

    act(async () => {
      expect(
        await screen.findByText(
          'Verify your personal and business information so we can setup your account.',
        ),
      ).toBeInTheDocument();

      userEvent.click(screen.getByTestId('start-account-verification'));
      expect(screen.queryByText(/Upload Identity Proof/)).toBeInTheDocument();
      expect(
        screen.queryByText("Upload Last Year's Tax Return"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Documents of Incorporation/),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Direct Deposit Information/),
      ).toBeInTheDocument();
    });
  });

  test('should render account verifcation with 4 steps as LLC/C-Corp/S-Corp', () => {
    setup({ entityType: ENTITY_MAPPING.llc });

    act(async () => {
      expect(
        await screen.findByText(
          'Verify your personal and business information so we can setup your account.',
        ),
      ).toBeInTheDocument();

      userEvent.click(screen.getByTestId('start-account-verification'));
      expect(screen.queryByText(/Upload Identity Proof/)).toBeInTheDocument();
      expect(
        screen.queryByText("Upload Last Year's Tax Return"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Documents of Incorporation/),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Direct Deposit Information/),
      ).toBeInTheDocument();
    });
  });
});
