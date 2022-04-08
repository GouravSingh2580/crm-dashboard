import { render } from '@testing-library/react';
import { usePlaidLink } from 'react-plaid-link';
import { ConnectionButton } from '../ConnectionButton';
import { useAccessToken } from '../../../hooks/api/useBankAccount';

jest.mock('hooks/api/useBankAccount', () => ({
  useAccessToken: jest.fn(),
}));
jest.mock('react-plaid-link', () => ({
  usePlaidLink: jest.fn(),
}));

describe('Connection Button test', () => {
  it('Should enable connection button by default', () => {
    (useAccessToken as jest.Mock).mockReturnValue({ setAccessToken: jest.fn() });
    (usePlaidLink as jest.Mock).mockReturnValue({ open: jest.fn(), ready: true });
    const { getByTestId } = render(<ConnectionButton linkToken="testabc" accountId="123" />);
    expect(getByTestId('connectButton')).toBeTruthy();
    expect(getByTestId('connectButton')).toBeEnabled();
  });

  it('Should enable connection button', () => {
    (useAccessToken as jest.Mock).mockReturnValue({ setAccessToken: jest.fn() });
    (usePlaidLink as jest.Mock).mockReturnValue({ open: jest.fn(), ready: true });
    const { getByTestId } = render(<ConnectionButton linkToken="testabc" accountId="123" disabled={false} />);
    expect(getByTestId('connectButton')).toBeTruthy();
    expect(getByTestId('connectButton')).toBeEnabled();
  });

  it('Should disable connection button', () => {
    (useAccessToken as jest.Mock).mockReturnValue({ setAccessToken: jest.fn() });
    (usePlaidLink as jest.Mock).mockReturnValue({ open: jest.fn(), ready: true });
    const { getByTestId } = render(<ConnectionButton linkToken="testabc" accountId="123" disabled />);
    expect(getByTestId('connectButton')).toBeTruthy();
    expect(getByTestId('connectButton')).toBeDisabled();
  });
});
