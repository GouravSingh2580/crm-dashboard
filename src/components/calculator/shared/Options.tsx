import { ReactElement } from 'react';

import { FormControlLabel, Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(4, 0),
  },
  desc: {
    marginTop: theme.spacing(2),
    color: theme.palette.graylight.main,
    ...theme.typography.body3,
  },
  name: {
    color: theme.palette.black.main,
    ...theme.typography.body3,
  },
}));

type TProps = { name: string; desc: string; value: string; control: ReactElement };

export const Options = ({ name, desc, value, control }: TProps) => {
  const classes = useStyles();
  return (
    <div>
      <FormControlLabel
        value={value}
        control={control}
        label={name}
        key={name}
        classes={{ label: classes.name }}
      />
      {desc && <div className={classes.desc}>{desc}</div>}
      <Divider className={classes.divider} />
    </div>
  );
};
