import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '164px',
    alignItems: 'center',
  },
  securedTextField: {
    fontFamily: 'password',
  },
}));

interface TParams {
  value: string | number;
}

export const ReadOnlySSN = ({ value }: TParams) => {
  const classes = useStyles();
  const [visibility, setVisibility] = useState(false);

  if(!value){
    return (<span>N/A</span>)
  }

  return (
    <div className={classes.root}>
      <span className={!visibility? classes.securedTextField: ''}>
        {value}
      </span>
      <IconButton
        onClick={() => setVisibility(!visibility)}
        component="span"
        sx={{
          padding: 0,
        }}
      >
        {visibility ? <VisibilityOff />: <Visibility />}
      </IconButton>
    </div>
  );
};
