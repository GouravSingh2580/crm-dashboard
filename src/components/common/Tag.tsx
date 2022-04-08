import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  tag: {
    fontFamily: 'Roboto',
    backgroundColor: theme.palette.info.light,
    fontSize: '10px',
    lineHeight: '10px',
    fontWeight: 'bold',
    padding: '2px 4px',
    margin: theme.spacing(0, 1),
    color: '#fff',
    textTransform: 'uppercase',
    borderRadius: '5px',
  },
}));

interface Props {
  value: string;
}

export const Tag = ({ value }: Props) => {
  const classes = useStyles();

  return <span className={classes.tag}>{value}</span>;
};
