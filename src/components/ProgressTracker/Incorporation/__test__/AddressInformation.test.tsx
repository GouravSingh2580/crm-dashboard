import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ENTITY_MAPPING } from 'constants/common';
import { AddressInformation } from '../AddressInformation';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { useUpdateCompany } from 'hooks/api';
import TestUtils from 'react-dom/test-utils';

const changeInputMaskValue = (element: HTMLInputElement, value: string) => {
  element.value = value;
  element.selectionStart = element.selectionEnd = value.length;
  TestUtils.Simulate.change(element);
};

jest.mock('hooks/api', () => ({
  useUpdateCompany: jest.fn(),
}));

const mockUpdateCompany = jest.fn().mockResolvedValue(null);

const setup = ({
  handleComplete = jest.fn(),
  entityType = ENTITY_MAPPING.sole_prop,
  stageCompleted = false,
}) => {
  (useUpdateCompany as jest.Mock).mockImplementation(() => ({
    mutateAsync: mockUpdateCompany,
  }));

  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <AddressInformation
          handleComplete={handleComplete}
          stageCompleted={stageCompleted}
          companyData={{
            id: '123',
            entityType,
          }}
        />,
      ),
    ),
  );

  return {
    ...utils,
  };
};

test('should validate and save mailing address', async () => {
  const handleComplete = jest.fn();
  setup({ handleComplete });
  act(() => {
    userEvent.click(screen.getByTestId('save-address'));
  });
  expect(await screen.findAllByText(/Please enter an address./)).toHaveLength(
    1,
  );
  expect(await screen.findAllByText(/Please enter a city./)).toHaveLength(1);
  expect(await screen.findAllByText(/Please enter a state./)).toHaveLength(1);
  expect(
    await screen.findAllByText(/Please enter a valid ZIP code./),
  ).toHaveLength(1);
  expect(
    await screen.findByText(/Please enter a Phone Number./),
  ).toBeInTheDocument();

  userEvent.type(screen.getAllByLabelText('Address Line 1')[0], '123 Ave E');
  userEvent.type(screen.getAllByLabelText('City')[0], 'Seattle');
  userEvent.type(screen.getAllByLabelText('State')[0], 'Wash{enter}');
  userEvent.type(screen.getAllByLabelText('Zip Code')[0], '12345');
  act(() =>{
    userEvent.type(screen.getAllByLabelText('Phone Number')[0], '1234567890');
    changeInputMaskValue(screen.getAllByLabelText('Phone Number')[0] as HTMLInputElement, '1234567890');
  })

  await waitFor(() => {
    userEvent.click(screen.getByTestId('save-address'));
  });


    expect(mockUpdateCompany).toHaveBeenCalledWith({
      id: '123',
      data: {
        contactDetails: {
          mailingAddress: {
            street1: '123 Ave E',
            street2: '',
            city: 'Seattle',
            state: 'WA',
            zip: '12345',
          },
          physicalAddress: {
            street1: '123 Ave E',
            street2: '',
            city: 'Seattle',
            state: 'WA',
            zip: '12345',
          },
          workPhone: '(123) 456-7890',
        },
      },
    });
    expect(handleComplete).toHaveBeenCalledTimes(1)
});

test('should validate and save physical address', async () => {
  const handleComplete = jest.fn();
  setup({ handleComplete });

  act(() => {
    userEvent.click(
      screen.getByLabelText(
        'My business physical address is the same as my business mailing address',
      ),
    );
  });

  await waitFor(() => {
    userEvent.click(screen.getByText('Save and Continue'));
  });

  expect(screen.getAllByText(/Please enter an address./)).toHaveLength(2);
  expect(screen.getAllByText(/Please enter a city./)).toHaveLength(2);
  expect(screen.getAllByText(/Please enter a state./)).toHaveLength(2);
  expect(screen.getAllByText(/Please enter a valid ZIP code./)).toHaveLength(2);
  expect(screen.getAllByText(/Please enter a valid ZIP code./)).toHaveLength(2);
  expect(screen.getAllByText(/Please enter a Phone Number./)).toHaveLength(1);

  //fill mailling address
  userEvent.type(screen.getAllByLabelText('Address Line 1')[0], '123 Ave E');
  userEvent.type(screen.getAllByLabelText('City')[0], 'Seattle');
  userEvent.type(screen.getAllByLabelText('State')[0], 'Wash{enter}');
  userEvent.type(screen.getAllByLabelText('Zip Code')[0], '12345');
  act(() =>{
    userEvent.type(screen.getAllByLabelText('Phone Number')[0], '1234567890');
    changeInputMaskValue(screen.getAllByLabelText('Phone Number')[0] as HTMLInputElement, '1234567890');
  })

  //fill physical address
  userEvent.type(screen.getAllByLabelText('Address Line 1')[1], '321 Ave E');
  userEvent.type(screen.getAllByLabelText('City')[1], 'Miami');
  userEvent.type(screen.getAllByLabelText('State')[1], 'Flor{enter}');
  userEvent.type(screen.getAllByLabelText('Zip Code')[1], '54321');

  await waitFor(() => {
    userEvent.click(screen.getByText('Save and Continue'));
  });

  expect(mockUpdateCompany).toHaveBeenCalledWith({
    id: '123',
    data: {
      contactDetails: {
        mailingAddress: {
          street1: '123 Ave E',
          street2: '',
          city: 'Seattle',
          state: 'WA',
          zip: '12345',
        },
        physicalAddress: {
          street1: '321 Ave E',
          street2: '',
          city: 'Miami',
          state: 'FL',
          zip: '54321',
        },
        workPhone: '(123) 456-7890',
      },
    },
  });
  expect(handleComplete).toHaveBeenCalled();

});
