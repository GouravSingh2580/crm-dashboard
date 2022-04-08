import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { UploadGovID as UploadDocuments } from '../UploadGovID';
import {
  useDocumentsByAccount,
  useDocumentCategories,
  useCreateDocument,
  useDeleteDocument,
} from 'hooks/api';
import { ProgressTrackerStatus } from 'models/account';

jest.mock('hooks/api', () => ({
  useDocumentsByAccount: jest.fn(),
  useDocumentCategories: jest.fn(),
  useCreateDocument: jest.fn(),
  useDeleteDocument: jest.fn(),
}));

const handleContinue = jest.fn();
const mockCreateDocument = jest.fn().mockResolvedValue(null);
const mockDeleteDocument = jest.fn().mockResolvedValue(null);

const CATEGORY_DATA = {
  name: 'Miscellaneous',
  subcategory: 'Biographical Information',
  department: 'Permanent',
};
const TITLE = 'Proof of Identity';
const SUB_TITLE =
  "Please verify your identity by uploading front and back image of your Driver's License, State-Issued ID. (Acceptable file types: PNG, JPEG and PDF up to 5MB)";

const setup = ({
  title = TITLE,
  subtitle = SUB_TITLE,
  categoryData = CATEGORY_DATA,
}) => {
  (useDocumentsByAccount as jest.Mock).mockReturnValue({
    isLoading: false,
    documents: [],
    refetch: jest.fn(),
  });

  (useDocumentCategories as jest.Mock).mockReturnValue({
    categories: {},
    refetch: jest.fn(),
  });

  (useCreateDocument as jest.Mock).mockImplementation(() => ({
    mutateAsync: mockCreateDocument,
  }));

  (useDeleteDocument as jest.Mock).mockImplementation(() => ({
    mutateAsync: mockDeleteDocument,
  }));

  render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <UploadDocuments
          accountId="1"
          handleContinue={handleContinue}
          isLoading={false}
          currentStatus={ProgressTrackerStatus.Unknown}
          categoryData={categoryData}
          defaultYear={'Permanent'}
          title={title}
          subtitle={subtitle}
        />,
      ),
    ),
  );
};

test('should render Upload Identity Proof with correct data', async () => {
  setup({});
  expect(screen.getByText(TITLE)).toBeInTheDocument();
  expect(screen.getByText(SUB_TITLE)).toBeInTheDocument();
  expect(screen.getByText('Browse Files')).toBeInTheDocument();
  expect(
    screen.getByText('No documents have been uploaded yet.'),
  ).toBeInTheDocument();
  expect(screen.getByTestId('save-n-continue-btn')).toBeInTheDocument();
});

test('should validate only acceptable formats are allowed', async () => {
  setup({});
  const file = new File(['test'], 'test.txt', { type: 'plain/text' });
  act(() => {
    userEvent.upload(screen.getByLabelText('or drop it here'), file);
  });
  expect(
    await screen.findByText(
      'Unsupported file type, upload an acceptable file format.',
    ),
  ).toBeInTheDocument();
});

test('should validate user could not upload file over 5mb', async () => {
  setup({});
  const file = new File([new ArrayBuffer(1)], 'file.pdf', {
    type: 'application/pdf',
  });
  const bigFile = Object.defineProperty(file, 'size', {
    value: 1024 * 1024 * 6,
  });
  await waitFor(() => {
    userEvent.upload(screen.getByLabelText('or drop it here'), bigFile);
  });
  expect(
    await screen.findByText(/The file is over 5MB, please retry .../),
  ).toBeInTheDocument();
});

test('should save file and complete step', async () => {
  setup({});
  const file = new File([new ArrayBuffer(1)], 'file.png', {
    type: 'image/png',
  });
  await waitFor(() => {
    userEvent.upload(screen.getByLabelText('or drop it here'), file);
  });
  expect(mockCreateDocument).toHaveBeenCalledTimes(1);
  userEvent.click(screen.getByTestId('save-n-continue-btn'));
  setTimeout(() => {
    expect(handleContinue).toHaveBeenCalledTimes(1);
  });
});
