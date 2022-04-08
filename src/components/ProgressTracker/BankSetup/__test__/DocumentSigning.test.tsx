import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { DocumentSigning } from '../DocumentSigning';
import { ENTITY_MAPPING } from '../../../../constants/common';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';
import { ProgressTrackerStages } from 'models/account';

jest.mock('helpers/heap/progressTrackerEvent', () => ({
  sendProgressTrackerEvent: jest.fn(),
}));

const setup = ({
  bankName = '',
  completedSteps = 0,
  rightSignatureURL = '',
}) => {
  render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <DocumentSigning
          accountId={'123'}
          accountEntity={ENTITY_MAPPING.sole_prop}
          completedSteps={completedSteps}
          hasBankAccount={!!bankName}
          rightSignatureURL={rightSignatureURL}
        />,
      ),
    ),
  );
};

test('should render when bank selection not completed', async () => {
  setup({});
  expect(screen.getByTestId('document-signing-heading')).toBeInTheDocument();
  expect(
    screen.getByText(
      /Please complete Bank Selection./,
    ),
  ).toBeInTheDocument();
  expect(screen.getByTestId('document-signing-sign-btn')).toHaveAttribute('disabled')
});

test('should render when bank selection is completed but Signing URL is not available', async () => {
  setup({ bankName: 'World Bank'});
  expect(screen.getByTestId('document-signing-heading')).toBeInTheDocument();
  expect(
    screen.getByText(
      /Information you provided is being reviewed. We will notify you once the signature packet is available for signing./,
    ),
  ).toBeInTheDocument();
  expect(screen.getByTestId('document-signing-sign-btn')).toHaveAttribute('disabled')
});

test('should render when Signing URL available', async () => {
  setup({ bankName: 'World Bank', rightSignatureURL: 'some-url'});
  expect(screen.getByTestId('document-signing-heading')).toBeInTheDocument();
  expect(
    screen.getByText(
      /Your document packet is ready to sign, you are required to sign these documents and submit, for us to verify and proceed further./,
    ),
  ).toBeInTheDocument();
  userEvent.click(screen.getByTestId('document-signing-sign-btn'))
  expect(sendProgressTrackerEvent).toHaveBeenCalledWith({
    stage: ProgressTrackerStages.DocumentSigning,
    accountId: '123',
    entityType: ENTITY_MAPPING.sole_prop,
  });
});
