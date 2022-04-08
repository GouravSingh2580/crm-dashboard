import { ReactNode } from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: theme.palette.onboardingBackground.main,
    flexGrow: 1,
    height: '100vh',
    overflowY: 'auto',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

interface PlainProps {
  children: ReactNode
}

export const PlainLayout = ({ children }: PlainProps) => {
  const classes = useStyles();
  return (
    <div id="page" className={classes.page}>
      {children}
    </div>
  );
};
