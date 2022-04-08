import { render, fireEvent, screen } from '@testing-library/react';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { LocalizationProvider } from '@mui/lab';
import { TransactionFilterDrawer } from 'components/bookkeeping/TransactionsFilterDrawer';
import { warpQueryClientProvider } from 'hooks/api/__testMock__/TestComponent';

const onFiltersChange = jest.fn();
const setIsFilterOpen = jest.fn();
const refresh = jest.fn();

const setup = () => {
  const isFilterOpen = true;
  const filters = {
    from: undefined,
    to: undefined,
    category: '',
    source: undefined,
    amountGreaterThan: undefined,
    amountLessThan: undefined,
  };

  const utils = render(
    warpQueryClientProvider(
      wrapThemeProvider(
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TransactionFilterDrawer
            open={isFilterOpen}
            filters={filters}
            onChange={onFiltersChange}
            onClose={() => setIsFilterOpen(false)}
            refresh={refresh}
          />
        </LocalizationProvider>,
      ),
    ),
  );
  return {
    ...utils,
  };
};

describe('bank transaction filter test', () => {
  it('shows filter header', () => {
    const utils = setup();
    const headerElement = utils.getByTestId('filter-header');
    expect(headerElement.textContent).toBe('Filters');
  });

  it('contains Category, From, To, Amount Greater Than and Amount Less Than inputs', () => {
    setup();
    expect(screen.getByTestId('select-category')).toBeInTheDocument();
    expect(screen.getByTestId('select-source')).toBeInTheDocument();
    expect(screen.getByTestId('filter-from-date')).toBeInTheDocument();
    expect(screen.getByTestId('filter-to-date')).toBeInTheDocument();
    expect(screen.getByTestId('filter-amount-greater')).toBeInTheDocument();
    expect(screen.getByTestId('filter-amount-less')).toBeInTheDocument();
  });

  it('changes amount greater than value on change event', () => {
    const utils = setup();
    const amountInput = utils
      .getByTestId('filter-amount-greater')
      .querySelector('input');
    expect((amountInput as HTMLInputElement).value).toBe('');
    fireEvent.change(amountInput as HTMLInputElement, {
      target: { value: '10' },
    });
    expect((amountInput as HTMLInputElement).value).toBe('10');
  });

  it('changes category value on change event', () => {
    const utils = setup();
    const categoryInput = utils.getByTestId('select-category');
    expect((categoryInput as HTMLSelectElement).value).toBe(undefined);
    (categoryInput as HTMLSelectElement).value = 'Travel';
    fireEvent.change(categoryInput);
    expect((categoryInput as HTMLSelectElement).value).toBe('Travel');
  });

  it.skip('changes from date value on change event', async () => {
    const utils = setup();
    const fromInput = utils
      .getByTestId('filter-from-date')
      .querySelector('input');
    expect((fromInput as HTMLInputElement).value).toBe('');
    fireEvent.change(fromInput as HTMLInputElement, {
      target: { value: '12/20/2109' },
    });
    expect((fromInput as HTMLInputElement).value).toBe('12/20/2109');
  });
});
