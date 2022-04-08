import React from 'react';
import { EditableNoteCell } from '../BankTransactionsTable/EditableNoteCell';
import { fireEvent, render } from '@testing-library/react';
import { wrapThemeProvider } from 'helpers/__tests__/mockTheme';
import { transactionTableHeaders } from 'enums';

describe("Editable Note Cell component", () => {
    it("should show Notes icon when notes are present for a transaction", () => {
        const notes = 'This is a note.';
        const toggleEdit = jest.fn();
        const resetEdit = jest.fn();
        const { getByTestId } = render(wrapThemeProvider(<EditableNoteCell
            notes={notes}
            onToggleEditMode={
              (isEdit) => (isEdit ? toggleEdit(0, transactionTableHeaders.NOTES) : resetEdit())
            }
          />))
        const svg = getByTestId('NotesIcon');
        expect(svg).toBeTruthy();
    });

    it("should show Add icon when notes are not present for a transaction", () => {
        const notes = '';
        const toggleEdit = jest.fn();
        const resetEdit = jest.fn();
        const { getByTestId } = render(wrapThemeProvider(<EditableNoteCell
            notes={notes}
            onToggleEditMode={
              (isEdit) => (isEdit ? toggleEdit(0, transactionTableHeaders.NOTES) : resetEdit())
            }
          />))
        const svg = getByTestId('AddIcon');
        expect(svg).toBeTruthy();
    });

    it("should show notes edit box on click", () => {
        const notes = '';
        const toggleEdit = jest.fn();
        const resetEdit = jest.fn();
        const { getByRole } = render(wrapThemeProvider(<EditableNoteCell
            notes={notes}
            onToggleEditMode={
              (isEdit) => (isEdit ? toggleEdit(0, transactionTableHeaders.NOTES) : resetEdit())
            }
          />))
        const button = getByRole('button');
        fireEvent.click(button);
        expect(toggleEdit).toHaveBeenCalled();
    });
});
