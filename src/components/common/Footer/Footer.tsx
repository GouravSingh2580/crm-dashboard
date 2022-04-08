import makeStyles from '@mui/styles/makeStyles';
import { ReactComponent as FacebookIcon } from 'icons/facebook.svg';
import { ReactComponent as YoutubeIcon } from 'icons/youtube.svg';
import { ReactComponent as MailIcon } from 'icons/mail.svg';
import { ReactComponent as LinkedInIcon } from 'icons/linkedin.svg';
import { MENU_ITEMS } from './constant';

const useStyles = makeStyles((theme) => ({
  footer: {
    paddingBottom: theme.spacing(16),
    background: theme.palette.primary.contrastText,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1155px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0 16px',
  },
  icon: {
    width: '24px',
    height: '24px',
    marginRight: theme.spacing(2),
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  iconsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  upperContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(3, 0),
    flexFlow: 'row wrap',
    flex: '0 0 100%',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'start',
      marginTop: theme.spacing(3),
    },
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  menuItemsContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'start',
      marginTop: theme.spacing(3),
      borderTop: `1px solid rgba(151,151,151,.25)`,
      width: '100%',
    },
  },
  menuItem: {
    marginLeft: theme.spacing(7),
    fontSize: '14px',
    color: theme.palette.grey[500],
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      marginTop: theme.spacing(4),
      marginLeft: '0px',
    },
  },
  disclaimer: {
    fontSize: '12px',
    color: theme.palette.grey[500],
    lineHeight: '20px',
    display: 'flex',
    marginTop: '24px',
    [theme.breakpoints.up('sm')]: {
      marginRight: '40px',
      fontSize: '14px',
    },
  },
  disclaimerContainer: {
    width: '66%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  bottomInnerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    borderTop: `1px solid rgba(151,151,151,.25)`,
    width: '67%',
    flexFlow: 'row wrap',
    flex: '0 0 100%',
  },
}));
export const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <div className={classes.upperContainer}>
        <div className={classes.iconsContainer}>
          <div className={classes.icon}>
            <a
              href="https://www.linkedin.com/company/formationscorp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon className={classes.svg} />
            </a>
          </div>
          <div className={classes.icon}>
            <a
              href="https://www.facebook.com/Formationscorp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon className={classes.svg} />
            </a>
          </div>
          <div className={classes.icon}>
            <a
              href="mailto:team@formations.corp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MailIcon className={classes.svg} />
            </a>
          </div>
          <div className={classes.icon}>
            <a
              href="https://www.youtube.com/channel/UCdIoM-lbA5i274JP8iIt7Og"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeIcon className={classes.svg} />
            </a>
          </div>
        </div>
        <div className={classes.menuItemsContainer}>
          {MENU_ITEMS.map((data) => (
            <div key={data.id} className={classes.menuItem}>
              <a href={data.url}>
                <span>{data.label}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className={classes.bottomContainer}>
        <div className={classes.bottomInnerContainer}>
          <div className={classes.disclaimerContainer}>
            <div className={classes.disclaimer}>
              Formations is a new type of financial solution. We automate the
              creation and ongoing management of S-Corp, the most efficient tax
              structure for the self-employed, and by doing so, we save
              thousands of dollars every year on taxes, provide affordable
              health insurance and other corporate-level benefits, and issue
              monthly paychecks so our users can enjoy the perks of a
              predictable income. We believe that being independent shouldn’t
              mean being alone, and are on a mission to become the largest
              employer of self-employed individuals in the US. Join us today to
              unlock your financial potential.
            </div>
            <div className={classes.disclaimer}>
              <a
                role="menuitem"
                href="https://formationscorp.com/privacy-policy/"
                target="_self"
              >
                Privacy Policy
              </a>
              &nbsp;|&nbsp;
              <a
                role="menuitem"
                href="https://formationscorp.com/terms-of-use/"
                target="_self"
              >
                Terms of Use
              </a>
              <a
                role="menuitem"
                href="https://formationscorp.com/cookie-policy/"
                target="_self"
              >
                &nbsp;|&nbsp; Cookie Policy
              </a>
            </div>
          </div>
          <div className={classes.disclaimer}>
            <div style={{ display: 'flex' }}>
              <div>©2021&nbsp;</div>
              <div style={{ marginRight: '24px' }}>All right reserved.</div>
            </div>
            <a
              href="https://formationscorp.com/privacy-policy/"
              className="footer__privacy"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
