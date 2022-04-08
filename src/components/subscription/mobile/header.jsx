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
    fontSize: '0.875rem',
    fontWeight: '400',
    color: theme.palette.black.main,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(5),
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

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <img src={image} className={classes.image} alt="report" />
      <div className={classes.title}>Ready to Save on Taxes?</div>
      <div className={classes.subTitle}>
        Getting started with Formations is super easy. Just pick a plan, give us
        some starter info, and then sit back and relax while we get you set up!
      </div>
    </div>
  );
};

export default Header;
