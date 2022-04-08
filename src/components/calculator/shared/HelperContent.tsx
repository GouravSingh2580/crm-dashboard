import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  modalWrapper: {
    padding: theme.spacing(4, 3),
    width: '400px',
    [theme.breakpoints.down('md')]: {
      width: '272px',
    },
    background: theme.palette.white.main,
  },
  label: {
    color: theme.palette.black.main,
    fontWeight: '500',
    fontSize: '16px',
  },
  desc: {
    marginTop: theme.spacing(2),
    color: theme.palette.graylight.main,
    marginBottom: theme.spacing(4),
    fontSize: '14px',
    lineHeight: '21px',
  },
}));

type THelperTip = { label: string; desc: string };

type TProps = {
  data: THelperTip[];
};

export const HelperContent = ({ data }: TProps) => {
  const classes = useStyles();

  const helperTip = ({ label, desc }: THelperTip) => (
    <>
      <div className={classes.label}>{label}</div>
      <div className={classes.desc}>{desc}</div>
    </>
  );

  return (
    <div className={classes.modalWrapper}>
      {data.map((tip: THelperTip) => helperTip(tip))}
    </div>
  );
};
