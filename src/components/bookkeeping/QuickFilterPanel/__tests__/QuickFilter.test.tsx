import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { QuickFilter } from '../QuickFilter';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';

const setQuickFilterId = jest.fn();

describe("Quick Filter Component", () => {
    it("should show quick filter", () => {
        const filter = {
            id: 'all',
            label: 'All transactions',
            data: {
              categoryId: undefined,
              amountGreaterThan: undefined,
              amountLessThan: undefined,
            },
            count: 0,
        };
        const { getByRole } = render(wrapThemeProvider(<QuickFilter
            label={filter.label}
            count={filter.count}
            selected={false}
            onClick={() => setQuickFilterId(filter.id)}
        />));
        expect(getByRole('button')).toHaveTextContent(filter.label);
    });

    it("should show quick filter count if present", () => {
        const filter = {
            id: 'all',
            label: 'All transactions',
            data: {
              categoryId: undefined,
              amountGreaterThan: undefined,
              amountLessThan: undefined,
            },
            count: 2,
        };
        const { getByRole, getByTestId } = render(wrapThemeProvider(<QuickFilter
            label={filter.label}
            count={filter.count}
            selected={false}
            onClick={() => setQuickFilterId(filter.id)}
        />));
        expect(getByRole('button')).toHaveTextContent(filter.label);
        expect(getByTestId('quick-filter-badge')).toBeTruthy();
        expect(getByTestId('quick-filter-badge')).toHaveTextContent(String(filter.count));
    });

    it("should setQuickFilterId on click", async() => {
        const filter = {
            id: 'all',
            label: 'All transactions',
            data: {
              categoryId: undefined,
              amountGreaterThan: undefined,
              amountLessThan: undefined,
            },
            count: 2,
        };
        const { getByRole } = render(wrapThemeProvider(<QuickFilter
            label={filter.label}
            count={filter.count}
            selected={false}
            onClick={() => setQuickFilterId(filter.id)}
        />));
        const button = getByRole('button');
        fireEvent.click(button);
        expect(setQuickFilterId).toHaveBeenCalledTimes(1);
    });

});