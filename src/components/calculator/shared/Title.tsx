import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  title: {
    ...theme.typography.h6B,
    marginBottom: theme.spacing(2),
  },
}));

type TProps = {
  title: string;
}

export const Title = ({ title }: TProps) => {
  const classes = useStyles();
  return (
    <Typography data-testid="title" className={classes.title} component="h6">
      {title}
    </Typography>
  );
};
