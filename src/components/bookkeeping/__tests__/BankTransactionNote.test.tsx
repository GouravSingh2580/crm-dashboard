import { fireEvent, render } from '@testing-library/react';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { BankTransactionNote } from '../BankTransactionsTable/BankTransactionNote';
import { transactions } from './data.mock';

const onUpdateTransaction = jest.fn();
const toggleEdit = jest.fn();

describe('Bank Transaction Note Component', () => {
  it('should show the transaction note on render', () => {
    const { getByTestId } = render(
      wrapThemeProvider(
        <BankTransactionNote
          top="73px"
          row={transactions[0]}
          index={0}
          onUpdateTransaction={onUpdateTransaction}
          toggleEdit={toggleEdit}
        />,
      ),
    );
    expect(getByTestId('edit-note')).toBeTruthy();
    expect(getByTestId('save-note')).toBeDisabled();
  });

  it('should show text box on clicking on note to edit', () => {
    const { getByTestId } = render(
      wrapThemeProvider(
        <BankTransactionNote
          top="73px"
          row={transactions[0]}
          index={0}
          onUpdateTransaction={onUpdateTransaction}
          toggleEdit={toggleEdit}
        />,
      ),
    );
    expect(getByTestId('save-note')).toBeDisabled();
    expect(getByTestId('note-textbox')).toBeTruthy();
  });

  it('should enable save button when not text is edited', () => {
    const utils = render(
      wrapThemeProvider(
        <BankTransactionNote
          top="73px"
          row={transactions[0]}
          index={0}
          onUpdateTransaction={onUpdateTransaction}
          toggleEdit={toggleEdit}
        />,
      ),
    );
    const input = utils.getByTestId('note-textbox');
    fireEvent.change(input, {
      target: { value: `${transactions[0].notes}test` },
    });
    expect(utils.getByTestId('save-note')).toBeEnabled();
  });

  it('should update transaction and toggle edit on Save', () => {
    const utils = render(
      wrapThemeProvider(
        <BankTransactionNote
          top="73px"
          row={transactions[0]}
          index={0}
          onUpdateTransaction={onUpdateTransaction}
          toggleEdit={toggleEdit}
        />,
      ),
    );
    const input = utils.getByTestId('note-textbox');
    fireEvent.change(input, {
      target: { value: `${transactions[0].notes}test` },
    });
    const button = document.querySelector('button');
    if (button) {
      fireEvent.click(button);
    }
    expect(onUpdateTransaction).toBeCalled();
    expect(toggleEdit).toBeCalled();
  });
});
