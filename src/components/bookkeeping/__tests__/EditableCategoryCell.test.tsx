import React from 'react';
import { render } from '@testing-library/react';
import { EditableCategoryCell } from '../BankTransactionsTable/EditableCategoryCell';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { categories } from 'components/bookkeeping/__tests__/data.mock';
const onToggleEditMode = jest.fn();
const onUpdateTransaction = jest.fn();

describe('Editable Category Cell', () => {
  it('should show a button with text category name when category is present', () => {
    const { getByTestId } = render(
      wrapThemeProvider(
        <EditableCategoryCell
          category="category-1"
          categoryId="category-1-id"
          categories={categories}
          onToggleEditMode={onToggleEditMode}
          onChange={onUpdateTransaction}
        />,
      ),
    );
    const button = getByTestId('transaction-category-toggle');
    expect(button).toHaveTextContent('category-1');
  });

  it('should show a button with text Choose a category when no category is present', () => {
    const { getByTestId } = render(
      wrapThemeProvider(
        <EditableCategoryCell
          category=""
          categoryId=""
          categories={categories}
          onToggleEditMode={onToggleEditMode}
          onChange={onUpdateTransaction}
        />,
      ),
    );
    const button = getByTestId('transaction-category-toggle');
    expect(button).toHaveTextContent('Choose A Category');
  });

  it('should show select when edit mode is true', () => {
    const { getByTestId } = render(
      wrapThemeProvider(
        <EditableCategoryCell
          category=""
          categoryId=""
          categories={categories}
          onToggleEditMode={onToggleEditMode}
          onChange={onUpdateTransaction}
        />,
      ),
    );
    const select = getByTestId('transaction-category-select-input');
    expect(select).toBeTruthy();
  });
});
