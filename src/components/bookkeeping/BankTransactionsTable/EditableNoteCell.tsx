import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import NotesIcon from '@mui/icons-material/Notes';
import { MAIN_COLOR } from 'theme/constant';

interface Props {
  notes: string;
  onToggleEditMode: (isEdit?: boolean) => void;
}

const useStyles = makeStyles(() => ({
  field: {
    fontSize: 14,
  },
  addNotesIcon: {
    color: MAIN_COLOR,
    opacity: '0.5',
    cursor: 'pointer',
  },
  editNotesIcon: {
    color: MAIN_COLOR,
    cursor: 'pointer',
  },
}));

export const EditableNoteCell = ({ notes, onToggleEditMode }: Props) => {
  const classes = useStyles();
  const toggleEdit = () => onToggleEditMode(true);
  return (
    <div role="button" tabIndex={0} onClick={toggleEdit} onKeyDown={toggleEdit}>
      {notes === '' ? (
        <AddIcon className={classes.addNotesIcon} />
      ) : (
        <NotesIcon className={classes.editNotesIcon} />
      )}
    </div>
  );
};
