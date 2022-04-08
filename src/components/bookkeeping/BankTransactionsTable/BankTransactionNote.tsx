import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, TextField } from '@mui/material';
import { transactionTableHeaders } from 'enums';
import { TransactionItem } from './BankTransactionsTable';

interface Props {
  top: string;
  row: TransactionItem;
  index: number;
  onUpdateTransaction: (
    transaction: TransactionItem,
    note: string,
    type: string,
  ) => {};
  toggleEdit: (index: number, key: string) => void;
}

const useStyles = makeStyles((theme) => ({
  editNote: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    right: '1px',
    width: '283px',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    zIndex: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    boxShadow:
      '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(13 34 89 / 14%), 0px 6px 30px 5px rgb(13 34 89 / 12%)',
    justifyContent: 'space-between',
    overflowWrap: 'break-word',
    fontWeight: 500,
    letterSpacing: '-0.15px',
    lineHeight: '23px',
  },
  noteBody: {
    flexGrow: 1,
    padding: '16.5px 14px',
    letterSpacing: '-0.15px',
    whiteSpace: 'pre-wrap',
  },
  noteFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  notesEmpty: {
    opacity: '0.5',
  },
  saveButton: {
    cursor: 'pointer',
  },
  noteField: {
    margin: 0,
    padding: '0 !important',
  },
  noBorder: {
    border: 'none',
  },
}));

export const BankTransactionNote = ({
  top,
  row,
  index,
  onUpdateTransaction,
  toggleEdit,
}: Props) => {
  const [noteText, setNoteText] = useState(row.notes);
  const [topValue, setTopValue] = useState(top);
  const classes = useStyles();

  useEffect(() => {
    setTopValue(top);
  }, [top]);

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteText(event.target.value);
  };

  const onSubmitNote = (transaction: TransactionItem, note: string) => {
    toggleEdit(index, transactionTableHeaders.NOTES);
    onUpdateTransaction(transaction, note, transactionTableHeaders.NOTES);
  };

  return (
    <td
      id="editNote"
      data-testid="edit-note"
      className={classes.editNote}
      style={{ top: topValue }}
    >
      <TextField
        id="note-textbox"
        className={classes.noteField}
        value={noteText}
        onChange={onTextChange}
        InputProps={{
          classes: { notchedOutline: classes.noBorder },
          inputProps: {
            'data-testid': 'note-textbox',
          },
        }}
        variant="outlined"
        margin="normal"
        fullWidth
        placeholder="add a comment"
        multiline
      />
      <div className={classes.noteFooter}>
        <Button
          variant="text"
          data-testid="save-note"
          onClick={() => onSubmitNote(row, noteText)}
          disabled={noteText === row?.notes}
        >
          Save
        </Button>
      </div>
    </td>
  );
};
