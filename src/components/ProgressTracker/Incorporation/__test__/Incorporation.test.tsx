import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Incorporation } from '../Incorporation';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import {
  useCurrentCompany,
  useCurrentAccount,
  useUpdateAccountProgress,
} from 'hooks/api';

jest.mock('hooks/api', () => ({
  useCurrentCompany: jest.fn(),
  useCurrentAccount: jest.fn(),
  useUpdateAccountProgress: jest.fn(),
}));

// mocking personal detail component as it's not in the scope of Incorporation tests
jest.mock('../PersonalDetails', () => ({
  __esModule: true,
  PersonalDetails: () => {
    return <div>Mocked personal details</div>;
  },
}));

describe('Incorporation Stage', () => {

  beforeEach(() => {
    (useUpdateAccountProgress as jest.Mock).mockImplementation(() => ({
      mutateAsync: jest.fn(),
    }));
  });

  test('should render 3 steps for LLC', async () => {
    const currentCompany = { accountId: '123', id: '123', entityType: 'LLC' };
    (useCurrentCompany as jest.Mock).mockReturnValue({
      currentCompany,
      isLoading: false,
      status: 'success',
    });

    (useCurrentAccount as jest.Mock).mockReturnValue({
      currentAccount: { id: '123', progress: [], entityType: 'LLC' },
      isLoading: false,
      status: 'success',
      refetch: jest.fn(),
    });

    render(
      warpQueryClientProvider(
        wrapThemeProvider(<Incorporation isDesktop={true} />),
      ),
    );
    userEvent.click(screen.getByTestId('start-incorporation'));
    expect(screen.getByTestId('incorporation-stages')).toBeInTheDocument();
    expect(screen.queryByText(/Personal Details/)).toBeInTheDocument();
    expect(screen.queryByText(/Company Details/)).toBeInTheDocument();
    expect(screen.queryByText(/Business Address/)).toBeInTheDocument();
    // shouldn't render 'Filing Documents' in case of LLC
    expect(screen.queryByText(/Filing Documents/)).not.toBeInTheDocument();
    // should load first step
    expect(screen.queryByText(/Mocked personal details/)).toBeInTheDocument();
  });

  test('should render 4 steps for Sole-Prop', async () => {
    const currentCompany = {
      accountId: '123',
      id: '123',
      entityType: 'Sole-Prop',
    };
    (useCurrentCompany as jest.Mock).mockReturnValue({
      currentCompany,
      isLoading: false,
      status: 'success',
    });

    (useCurrentAccount as jest.Mock).mockReturnValue({
      currentAccount: { id: '123', progress: [], entityType: 'Sole-Prop' },
      isLoading: false,
      status: 'success',
      refetch: jest.fn(),
    });

    render(
      warpQueryClientProvider(
        wrapThemeProvider(<Incorporation isDesktop={true} />),
      ),
    );
    userEvent.click(screen.getByTestId('start-incorporation'));
    expect(screen.getByTestId('incorporation-stages')).toBeInTheDocument();
    expect(screen.queryByText(/Personal Details/)).toBeInTheDocument();
    expect(screen.queryByText(/Company Details/)).toBeInTheDocument();
    expect(screen.queryByText(/Business Address/)).toBeInTheDocument();
    expect(screen.queryByText(/Filing Documents/)).toBeInTheDocument();
    // should load first step
    expect(screen.queryByText(/Mocked personal details/)).toBeInTheDocument();
  });
});