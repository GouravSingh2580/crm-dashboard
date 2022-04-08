import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { ENTITY_MAPPING } from 'constants/common';
import {
  useCurrentUser,
  useCurrentCompany,
  useCurrentAccount,
} from 'hooks/api';
import { BankSetup } from '../BankSetup';

jest.mock('hooks/api', () => ({
  useCurrentUser: jest.fn(),
  useCurrentCompany: jest.fn(),
  useCurrentAccount: jest.fn(),
}));

const setup = ({ entityType = ENTITY_MAPPING.sole_prop }) => {
  (useCurrentUser as jest.Mock).mockReturnValue({
    currentUser: {
      id: '123',
    },
  });
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
    warpQueryClientProvider(wrapThemeProvider(<BankSetup isDesktop={true} />)),
  );
};

describe('Bank Setup Stage', () => {
  test('should render bank setup with 2 steps', async () => {
    setup({});

    setTimeout(() => {
      expect(screen.getByText(/Bank Selection/)).not.toBeInTheDocument();
      expect(screen.getByText(/Document Signing/)).not.toBeInTheDocument();
      act(() => {
        userEvent.click(screen.getByTestId('start-bank-setup'));
      });

      expect(
        screen.getByText(
          'Set up your bank preferences and sign a few forms. Our team will take it from there!',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/Bank Selection/)).toBeInTheDocument();
      expect(screen.getByText(/Document Signing/)).toBeInTheDocument();
    });
  });
});
