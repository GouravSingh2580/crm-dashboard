import { render } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useAccountByUserId } from 'hooks/api';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { Overview } from '../Overview';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useParams: jest.fn(),
}));
jest.mock('hooks/api', () => ({
  __esModule: true,
  useAccountByUserId: jest.fn(),
}));

describe('Overview Test', () => {
  it('normal value', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useAccountByUserId as jest.Mock).mockReturnValue({
      account: {
        ytdSalary: 50000,
        estimatedSalary: 80000,
      }
    });
    const result = render(
      warpQueryClientProvider(wrapThemeProvider(<Overview />)),
    );
    expect(
      result.getByTestId('field-value-annual-over-reasonable-compensation')
        .textContent,
    ).toBe('-');
    expect(result.getByTestId('field-value-remaining-salary').textContent).toBe(
      '$30,000',
    );
    expect(result.getByTestId('field-value-salary-taken').textContent).toBe(
      '$50,000',
    );
  });
  it('undefined value', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useAccountByUserId as jest.Mock).mockReturnValue({
      account: undefined,
    });
    const result = render(
      warpQueryClientProvider(wrapThemeProvider(<Overview />)),
    );
    expect(
      result.getByTestId('field-value-annual-over-reasonable-compensation')
        .textContent,
    ).toBe('-');
    expect(result.getByTestId('field-value-remaining-salary').textContent).toBe(
      'N/A',
    );
    expect(result.getByTestId('field-value-salary-taken').textContent).toBe(
      'N/A',
    );
  });
  it('overpay value', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useAccountByUserId as jest.Mock).mockReturnValue({
      account: {
        ytdSalary: 88000,
        estimatedSalary: 80000,
      }
    });
    const result = render(
      warpQueryClientProvider(wrapThemeProvider(<Overview />)),
    );
    expect(
      result.getByTestId('field-value-annual-over-reasonable-compensation')
        .textContent,
    ).toBe('$8,000');
    expect(result.getByTestId('field-value-remaining-salary').textContent).toBe(
      '$0',
    );
    expect(result.getByTestId('field-value-salary-taken').textContent).toBe(
      '$88,000',
    );
  });
  it('remaining 0 value', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useAccountByUserId as jest.Mock).mockReturnValue({
      account: {
        ytdSalary: 80000,
        estimatedSalary: 80000,
      }
    });
    const result = render(
      warpQueryClientProvider(wrapThemeProvider(<Overview />)),
    );
    expect(
      result.getByTestId('field-value-annual-over-reasonable-compensation')
        .textContent,
    ).toBe('-');
    expect(result.getByTestId('field-value-remaining-salary').textContent).toBe(
      '$0',
    );
    expect(result.getByTestId('field-value-salary-taken').textContent).toBe(
      '$80,000',
    );
  });
  it('fraction value', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (useAccountByUserId as jest.Mock).mockReturnValue({
      account: {
        ytdSalary: 45250.50,
        estimatedSalary: 47000.75,
      }
    });
    const result = render(
      warpQueryClientProvider(wrapThemeProvider(<Overview />)),
    );
    expect(
      result.getByTestId('field-value-annual-over-reasonable-compensation')
        .textContent,
    ).toBe('-');
    expect(result.getByTestId('field-value-remaining-salary').textContent).toBe(
      '$1,750.25',
    );
    expect(result.getByTestId('field-value-salary-taken').textContent).toBe(
      '$45,250.5',
    );
  });
});
