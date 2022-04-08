import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: '800',
    color: theme.palette.primary.main,
  },
  subTitle: {
    fontWeight: '500',
    marginBottom: theme.spacing(10),
  },
  titleContainer: {
    maxWidth: '1155px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0 16px',
  },
}));

interface Props{
  value: string | number
}

export const Header = ({ value }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.titleContainer}>
      <div>
        <Typography
          data-testid="txt-result-heading"
          variant="h3"
          className={classes.title}
          component="h3"
        >
          You can keep up to {value}
        </Typography>
        <Typography variant="h4" className={classes.subTitle} component="h4">
          in your pocket every year!
        </Typography>
      </div>
    </div>
  );
};
