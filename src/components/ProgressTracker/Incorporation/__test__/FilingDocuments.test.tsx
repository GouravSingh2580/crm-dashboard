import { render, screen } from '@testing-library/react';
import { FilingDocuments } from '../FilingDocuments';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { ENTITY_MAPPING } from 'constants/common';
import { MemoryRouter } from 'react-router-dom';

const setup = ({
  stageCompleted = false,
  completedSteps = 1,
  entityType = ENTITY_MAPPING.sole_prop,
}) => {
  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <MemoryRouter>
          <FilingDocuments
            accountId="123"
            stageCompleted={stageCompleted}
            companyData={{
              id: '123',
              entityType,
            }}
            completedSteps={completedSteps}
          />
        </MemoryRouter>,
      ),
    ),
  );

  return {
    ...utils,
  };
};

test('should validate Filing Documents when user not completed Incorporation', () => {
  setup({ completedSteps: 2 });
  expect(
    screen.getByText(
      'Please complete the previous steps, We need more info...',
    ),
  ).toBeInTheDocument();
});

test('should validate Filing Documents when user has completed previous steps', () => {
  setup({ completedSteps: 3 });
  expect(
    screen.getByText(
      'We’ll let you know when we receive your official paper from the IRS with your EIN in the next 2-7 days. In the meanwhile help us in verifying your account by providing details in the next stage.',
    ),
  ).toBeInTheDocument();
});

test('should validate Filing Documents when previuos steps completed but EIN not available for LLC', () => {
  setup({ completedSteps: 3, entityType: ENTITY_MAPPING.llc });
  expect(
    screen.getByText('Please complete the Company Detail steps, We need your EIN to file documents.'),
  ).toBeInTheDocument();
});

test('should validate Filing Documents when admin has completed the step', () => {
  setup({
    completedSteps: 3,
    entityType: ENTITY_MAPPING.c_corp,
    stageCompleted: true,
  });
  expect(
    screen.getByText(
      /Time to celebrate! All information is updated here. You can view your documents of incorporation in the/,
    ),
  ).toBeInTheDocument();
});
