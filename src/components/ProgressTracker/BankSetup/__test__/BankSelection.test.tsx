import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { BankSelection } from '../BankSelection';
import { useUpdateCompany } from 'hooks/api';
import { ENTITY_MAPPING } from '../../../../constants/common';
import { useUpdateTimeContactProperties } from 'hooks';

jest.mock('hooks/api', () => ({
  useUpdateCompany: jest.fn(),
}));

jest.mock('hooks', () => ({
  useUpdateTimeContactProperties: jest.fn(),
}));

const handleComplete = jest.fn();
const mockUpdateCompany = jest.fn().mockResolvedValue(null);
const mockUpdateTimeContactProperties = jest.fn().mockResolvedValue(null);

const COMPANY_DATA = {
  id: '123',
  hasBankAccount: false,
  useExistingBank: false,
  bankName: null,
  entityType: ENTITY_MAPPING.sole_prop,
};

const USER_DATA = {
  id: '123',
  accountId: '321',
  contactId: '123',
};

const setup = ({ userData = USER_DATA, companyData = COMPANY_DATA }) => {
  (useUpdateCompany as jest.Mock).mockImplementation(() => ({
    mutateAsync: mockUpdateCompany,
  }));

  (useUpdateTimeContactProperties as jest.Mock).mockImplementation(() => ({
    mutate: mockUpdateTimeContactProperties,
  }));

  render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <BankSelection
          company={companyData}
          user={userData}
          handleComplete={handleComplete}
        />,
      ),
    ),
  );
};

test("should select partner bank when user doesn't have an account", () => {
  setup({});

  expect(
    screen.getByText('Which bank would you like to use?'),
  ).toBeInTheDocument();
  expect(screen.getByText('How do I decide?')).toBeInTheDocument();
  expect(screen.getByLabelText(/Chase/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Bank of America/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Relay/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Wells Fargo/)).toBeInTheDocument();
  expect(screen.queryByLabelText(/Other/)).not.toBeInTheDocument();
  act(() => {
    userEvent.click(screen.getByLabelText(/Relay/));
  });
  userEvent.click(screen.getByText(/Save and Continue/));

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      bankName: 'relay',
      useOtherBank: false,
      useExistingBank: true,
      hasBankAccount: false,
    },
  });

  setTimeout(() => {
    expect(mockUpdateTimeContactProperties).toHaveBeenCalled();
  });
});

test('should verify user able to switch to Formations partner bank when already has an account', async () => {
  setup({
    companyData: {
      id: '123',
      useExistingBank: false,
      bankName: null,
      hasBankAccount: false,
      entityType: ENTITY_MAPPING.llc,
    },
  });
  // step 1
  expect(
    screen.getByText('Do you have a business bank account?'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/Yes/));
  userEvent.click(screen.getByText(/Save and Continue/));

  // step 2
  expect(
    screen.getByText('Which bank do you have a business account with?'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/Other/));
  userEvent.click(screen.getByText(/Save and Continue/));

  // step 3
  expect(
    screen.getByText(
      'Would you be willing to switch to one of our partner banks?',
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Who are Formations’ partner banks?'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/Yes/));
  userEvent.click(screen.getByText(/Save and Continue/));

  // step 4
  expect(
    screen.getByText('Which bank would you like to use?'),
  ).toBeInTheDocument();
  expect(screen.queryByLabelText(/Other/)).not.toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/Chase/));
  userEvent.click(screen.getByText(/Save and Continue/));

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      bankName: 'chase',
      useOtherBank: false,
      useExistingBank: true,
      hasBankAccount: true,
    },
  });
  setTimeout(() => {
    expect(mockUpdateTimeContactProperties).toHaveBeenCalled();
  });
});

test('should able to add other bank name when user already has an account', async () => {
  setup({
    companyData: {
      id: '123',
      useExistingBank: false,
      bankName: null,
      hasBankAccount: false,
      entityType: ENTITY_MAPPING.llc,
    },
  });
  // step 1
  expect(
    screen.getByText('Do you have a business bank account?'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/Yes/));
  userEvent.click(screen.getByText(/Save and Continue/));

  // step 2
  expect(
    screen.getByText('Which bank do you have a business account with?'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/Other/));
  userEvent.click(screen.getByText(/Save and Continue/));

  // step 3
  expect(
    screen.getByText(
      'Would you be willing to switch to one of our partner banks?',
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Who are Formations’ partner banks?'),
  ).toBeInTheDocument();

  userEvent.click(screen.getByLabelText(/No/));
  userEvent.click(screen.getByText(/Save and Continue/));

  // step 4
  expect(
    screen.getByText('Please enter your business bank name.'),
  ).toBeInTheDocument();
  expect(
    screen.queryByLabelText(/Your business bank name/),
  ).toBeInTheDocument();
  userEvent.type(screen.queryByLabelText(/Your business bank name/), 'My Bank');
  userEvent.click(screen.getByText(/Save and Continue/));

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      bankName: 'My Bank',
      useOtherBank: true,
      useExistingBank: false,
      hasBankAccount: true,
    },
  });
  setTimeout(() => {
    expect(mockUpdateTimeContactProperties).toHaveBeenCalled();
  });
});

test('should render bank selection with pre-selected bank name.', async () => {
  setup({
    companyData: {
      id: '123',
      hasBankAccount: true,
      useExistingBank: false,
      bankName: 'World Bank',
      entityType: ENTITY_MAPPING.s_corp,
    },
  });

  expect(
    screen.getByText('Please enter your business bank name.'),
  ).toBeInTheDocument();
  expect(screen.getByText(/Save and Continue/)).toHaveAttribute('disabled');
});
