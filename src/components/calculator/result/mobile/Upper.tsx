import makeStyles from '@mui/styles/makeStyles';
import image from 'icons/result.png';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: theme.palette.primary.main,
    marginTop: theme.spacing(4),
  },
  subTitle: {
    fontSize: '1.125rem',
    fontWeight: '800',
    color: theme.palette.primary.main,
  },
  image: {
    alignSelf: 'center',
    width: '166px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 16px',
  },
}));

type TProps = {
  value: string
}

export const Upper = ({ value }: TProps) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <img src={image} className={classes.image} alt="report" />
      <div data-testid="txt-result-heading" className={classes.title}>
        You can keep up to {value}
      </div>
      <div className={classes.subTitle}>in your pocket every year!</div>
    </div>
  );
};
