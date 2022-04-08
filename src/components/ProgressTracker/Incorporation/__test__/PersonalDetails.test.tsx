import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonalDetails } from '../PersonalDetails';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { LocalizationProvider } from '@mui/lab';
import AdapterMoment from '@mui/lab/AdapterMoment';

import {
  useCurrentUser,
  useUserIdentityById,
  useUpdateUser,
  useUpdateUserIdentity,
} from 'hooks/api';

jest.mock('hooks/api', () => ({
  useCurrentUser: jest.fn(),
  useUpdateUser: jest.fn(),
  useUpdateUserIdentity: jest.fn(),
  useUserIdentityById: jest.fn(),
}));

const mockUpdateUser = jest.fn().mockResolvedValue(null);
const mockUpdateUserIdentity = jest.fn().mockResolvedValue(null);

const setup = (handleComplete = jest.fn(), stageCompleted = false) => {
  (useUserIdentityById as jest.Mock).mockReturnValue({
    userIdentity: {
      ssn: {},
    },
  });

  (useUpdateUser as jest.Mock).mockImplementation(() => ({
    updateUserAsync: mockUpdateUser,
  }));

  (useUpdateUserIdentity as jest.Mock).mockImplementation(() => ({
    updateUserIdentityAsync: mockUpdateUserIdentity,
  }));

  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <PersonalDetails
            handleComplete={handleComplete}
            stageCompleted={stageCompleted}
          />
          ,
        </LocalizationProvider>,
      ),
    ),
  );
  return {
    ...utils,
  };
};

test('Should render personal details with default values', async () => {
  (useCurrentUser as jest.Mock).mockReturnValue({
    currentUser: {
      id: '123',
    },
  });
  act(() => {
    setup();
  });
  expect(screen.getByText(/Personal Details/)).toBeInTheDocument();
  expect(screen.getByText(/Let's get to know you better!/)).toBeInTheDocument();
  expect(screen.getAllByRole('textbox')).toHaveLength(5);
  expect(screen.queryAllByDisplayValue('')).toHaveLength(5);
  expect(screen.getByText(/Save and Continue/)).toBeInTheDocument();
});

test('should validate personal details', async () => {
  (useCurrentUser as jest.Mock).mockReturnValue({
    currentUser: {
      id: '123',
    },
  });
  act(() => {
    setup();
  });

  userEvent.type(screen.getByLabelText('First Name'), '123');
  userEvent.type(screen.getByLabelText('Middle Name'), '123');
  userEvent.type(screen.getByLabelText('Last Name'), '123');
  userEvent.type(screen.getByLabelText('Social Security Number'), '12345678');

  userEvent.type(screen.getByLabelText('Date of Birth'), Date());

  act(() => {
    userEvent.click(screen.getByTestId('save-personal-details'));
  });

  expect(
    await screen.findByText(/Please enter a valid first name./),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Please enter a valid middle name./),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Please enter a valid last name./),
  ).toBeInTheDocument();

  expect(
    screen.getByText(/You need to be at least 18 years old./),
  ).toBeInTheDocument();
  expect(screen.getByText(/Please enter a valid SSN./)).toBeInTheDocument();
});

test('should save personal details', async () => {
  const handleComplete = jest.fn();
  (useCurrentUser as jest.Mock).mockReturnValue({
    currentUser: {
      id: '123',
      dob: '12/12/2000',
    },
  });

  act(() => {
    setup(handleComplete, false);
  });

  userEvent.type(screen.getByLabelText('First Name'), 'Mary');
  userEvent.type(screen.getByLabelText('Middle Name'), 'D.');
  userEvent.type(screen.getByLabelText('Last Name'), 'Wang');
  userEvent.type(screen.getByLabelText('Social Security Number'), '123456789');

  await waitFor(() =>
    userEvent.click(screen.getByTestId('save-personal-details')),
  );

  expect(mockUpdateUser).toHaveBeenCalledWith({
    data: {
      name: { first: 'Mary', middle: 'D.', last: 'Wang' },
      dob: '12/12/2000',
    },
  });
  expect(mockUpdateUserIdentity).toHaveBeenCalledWith({
    id: '123',
    ssn: '123-45-6789',
  })
  expect(handleComplete).toHaveBeenCalledTimes(1)
});
