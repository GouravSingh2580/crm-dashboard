import { render, screen } from '@testing-library/react';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import useLoading from '../useLoading';

const LoadingWrapper = ({ flag }: {flag: boolean}) => useLoading(flag);

describe('useLoading test', () => {
  it('should return null', () => {
    const { container } = render(wrapThemeProvider(<LoadingWrapper flag={false} />));
    expect(container.children).toHaveLength(0);
  });

  it('should render loading', () => {
    render(wrapThemeProvider(<LoadingWrapper flag />));
    expect(screen.getByTestId('loading')).not.toBeNull();
  });
});
