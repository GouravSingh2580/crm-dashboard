import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ENTITY_MAPPING } from 'constants/common';
import { CompanyDetails } from '../CompanyDetails';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { LocalizationProvider } from '@mui/lab';
import AdapterMoment from '@mui/lab/AdapterMoment';

import { useUpdateCompany } from 'hooks/api';
import { ProgressTrackerStatus } from 'models/account';
import { UIDateFormat } from 'helpers/dateTimeFormat';

jest.mock('hooks/api', () => ({
  useUpdateCompany: jest.fn(),
}));

const mockUpdateCompany = jest.fn().mockResolvedValue(null);

const setup = ({
  handleComplete = jest.fn(),
  entityType = ENTITY_MAPPING.sole_prop,
  stageCompleted = false,
  status = null,
}) => {
  (useUpdateCompany as jest.Mock).mockImplementation(() => ({
    mutateAsync: mockUpdateCompany,
  }));

  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <CompanyDetails
            handleComplete={handleComplete}
            stageCompleted={stageCompleted}
            companyData={{
              id: '123',
              entityType,
            }}
            status={status}
          />
        </LocalizationProvider>,
      ),
    ),
  );

  return {
    ...utils,
  };
};

const saveStep2 = async () => {
  expect(
    await screen.findByText(
      'Now tell us what business industry you are in, the state of incorporation, and provide a brief business description.',
    ),
  ).toBeInTheDocument();
  userEvent.type(screen.getByLabelText('State of Incorporation'), '{enter}');
  userEvent.type(screen.getByLabelText('Business Industry'), '{enter}');
  expect(await screen.findByLabelText('Business Description')).toHaveValue(
    'General and special trade contractors primarily engaged in the construction of commercial or governmental properties',
  );

  await waitFor(() => {
    userEvent.click(screen.getByTestId('save-step-2'));
  });

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      industry: 'Construction',
      stateOfIncorporation: 'AL',
      description:
        'General and special trade contractors primarily engaged in the construction of commercial or governmental properties',
    },
  });
};

test('should render company details as Sole-Prop', () => {
  setup({});
  expect(screen.getByText(/Company Details/)).toBeInTheDocument();
  expect(
    screen.getByText(
      /Now, let's get to know your business. It's time to name your new LLC! We'll need at least 3 options in case your first and second choices are already taken./,
    ),
  ).toBeInTheDocument();

  expect(screen.getAllByLabelText(/Company Name - Option/)).toHaveLength(3);
  expect(screen.getByText(/\+Add another option/)).toBeInTheDocument();
  expect(screen.getByTestId('save-step-1')).toBeInTheDocument();
});

test('should validate company details as Sole-Prop', async () => {
  setup({});

  //step 1
  act(() => {
    userEvent.click(screen.getByTestId('save-step-1'));
  });

  expect(
    await screen.findAllByText(/Three company name options are required./),
  ).toHaveLength(3);

  act(() => {
    userEvent.click(screen.getByText(/\+Add another option/));
  });

  expect(
    screen.getAllByText(/Three company name options are required./),
  ).toHaveLength(4);

  userEvent.type(screen.getByLabelText('Company Name - Option 1'), 'Company');
  userEvent.type(screen.getByLabelText('Company Name - Option 2'), 'Company');
  userEvent.type(screen.getByLabelText('Company Name - Option 3'), 'Company');

  expect(
    await screen.findAllByText(/Company name options cannot be duplicates./),
  ).toHaveLength(3);

  userEvent.type(screen.getByLabelText('Company Name - Option 1'), 'Company1');
  userEvent.type(screen.getByLabelText('Company Name - Option 2'), 'Company2');
  userEvent.type(screen.getByLabelText('Company Name - Option 3'), 'Company3');
  act(() => {
    userEvent.click(screen.getByTestId('save-step-1'));
  });

  ///step 2

  expect(
    await screen.findByText(
      'Now tell us what business industry you are in, the state of incorporation, and provide a brief business description.',
    ),
  ).toBeInTheDocument();

  expect(screen.getByText(/Back/)).toBeInTheDocument();

  act(() => {
    userEvent.click(screen.getByTestId('save-step-2'));
  });

  expect(
    await screen.findByText(/Please enter a state of incorporation./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Please enter a business industry./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Please enter business description./),
  ).toBeInTheDocument();
});

test('should save company details as Sole-Prop', async () => {
  const handleComplete = jest.fn();
  setup({ handleComplete });

  //step 1
  userEvent.type(screen.getByLabelText('Company Name - Option 1'), 'Company1');
  userEvent.type(screen.getByLabelText('Company Name - Option 2'), 'Company2');
  userEvent.type(screen.getByLabelText('Company Name - Option 3'), 'Company3');
  await waitFor(() => {
    userEvent.click(screen.getByTestId('save-step-1'));
  });

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      ein: undefined,
      incorporationDate: undefined,
      name: undefined,
      hasEinNo: true,
      suggestedNames: ['Company1', 'Company2', 'Company3'],
    },
  });

  expect(handleComplete).toHaveBeenCalledWith(ProgressTrackerStatus.Started);

  // step 2
  await saveStep2();

  expect(handleComplete).toHaveBeenCalledWith(ProgressTrackerStatus.Completed);
});

test('should render company details as LLC/C-Corp/S-Corp', () => {
  setup({ entityType: ENTITY_MAPPING.llc });
  expect(screen.getByText(/Company Details/)).toBeInTheDocument();
  expect(
    screen.getByText(
      /Tell us more about your industry, what state you're operating in, and what your business is all about./,
    ),
  ).toBeInTheDocument();

  expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
  expect(screen.getByLabelText('Date of Incorporation')).toBeInTheDocument();
  expect(
    screen.getByLabelText('Employer Identification Number (EIN)'),
  ).toBeInTheDocument();
  expect(screen.getByTestId('save-step-1')).toBeInTheDocument();
});

test('should validate company details as LLC/C-Corp/S-Corp', async () => {
  setup({ entityType: ENTITY_MAPPING.c_corp });

  //step 1
  act(() => {
    userEvent.click(screen.getByTestId('save-step-1'));
  });

  expect(
    await screen.findByText(/Please enter a company name./),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Please enter a date of incorporation in MM/DD/YYYY.'),
  ).toBeInTheDocument();
  expect(screen.getByText(/Please enter a EIN./)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText('Company Name'), 'Company');
  userEvent.type(screen.getByLabelText('Date of Incorporation'), Date());
  userEvent.type(
    screen.getByLabelText('Employer Identification Number (EIN)'),
    '123456789',
  );

  act(() => {
    userEvent.click(screen.getByTestId('save-step-1'));
  });

  //step 2
  expect(
    await screen.findByText(
      'Now tell us what business industry you are in, the state of incorporation, and provide a brief business description.',
    ),
  ).toBeInTheDocument();

  expect(screen.getByText(/Back/)).toBeInTheDocument();

  act(() => {
    userEvent.click(screen.getByTestId('save-step-2'));
  });

  expect(
    await screen.findByText(/Please enter a state of incorporation./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Please enter a business industry./),
  ).toBeInTheDocument();
  expect(
    await screen.findByText(/Please enter business description./),
  ).toBeInTheDocument();
});

test('should save company details as LLC/C-Corp/S-Corp', async () => {
  const handleComplete = jest.fn();
  setup({ handleComplete, entityType: ENTITY_MAPPING.s_corp });

  //step 1
  userEvent.type(screen.getByLabelText('Company Name'), 'Company');
  userEvent.type(
    screen.getByLabelText('Employer Identification Number (EIN)'),
    '123456789',
  );
  const dateOfIncorporation = Date();

  userEvent.type(
    screen.getByLabelText('Date of Incorporation'),
    dateOfIncorporation,
  );

  await waitFor(() => {
    userEvent.click(screen.getByTestId('save-step-1'));
  });

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      ein: '123456789',
      hasEinNo: true,
      incorporationDate: UIDateFormat(dateOfIncorporation),
      name: 'Company',
      suggestedNames: undefined,
    },
  });

  expect(handleComplete).toHaveBeenCalledWith(ProgressTrackerStatus.Started);

  // step 2
  setTimeout(async () => {
    await saveStep2();
    expect(handleComplete).toHaveBeenCalledWith(
      ProgressTrackerStatus.Completed,
    );
  });
});
