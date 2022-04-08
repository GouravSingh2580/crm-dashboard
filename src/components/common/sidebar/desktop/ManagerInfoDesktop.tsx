import { Theme, Divider, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import makeStyles from '@mui/styles/makeStyles';
import { MAIN_COLOR } from 'theme/constant';
import { IAccount } from 'models/account';

interface Props {
  customerName: {
    first?: string;
    middle?: string;
    last?: string;
  };
  account?: IAccount;
}

const useStyles = makeStyles((theme: Theme) => ({
  itemList: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  email: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    }
  },
  call: {
    color: MAIN_COLOR,
    opacity: '0.7',
  },
  chat: {
    color: '#000000',
    opacity: '0.3',
  },
  header: {
    color: MAIN_COLOR,
    opacity: '0.7',
    fontSize: '13px',
  },
  successManager: {
    color: MAIN_COLOR,
    fontSize: '14px',
    fontWeight: '700',
    paddingBottom: theme.spacing(1),
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(
      3,
    )} ${theme.spacing(4)}`,
    alignItems: 'center',
  },
}));

export const ManagerInfoDesktop = ({ customerName, account }: Props) => {
  const { first, last } = { ...customerName };
  const classes = useStyles();
  return (
    <>
      <div className={classes.infoContainer}>
        <div className={classes.header}>Success Manager</div>
        <div className={classes.successManager}>{account?.csm?.name}</div>
        <div className={classes.itemList}>
          <IconButton
            className={classes.email}
            href={`mailto: ${account?.csm?.email}?subject=Query raised by ${first} ${last} from ${account?.companyName}`}
            target="_newtab"
          >
            <EmailIcon/>
          </IconButton>
        </div>
      </div>
      <Divider sx={{ marginLeft: 4, marginRight: 2 }} />
    </>
  );
};
