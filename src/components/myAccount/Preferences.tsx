import { useState } from 'react';
import { Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Title } from './Title';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}));

export const Preferences = () => {
  const classes = useStyles();
  const [isEdit, setIsEdit] = useState(false);
  return (
    <Paper className={classes.container}>
      <Title
        text="Preferences"
        isEdit={isEdit}
        onEdit={() => setIsEdit(true)}
        onCancel={() => setIsEdit(false)}
      />
    </Paper>
  );
};
