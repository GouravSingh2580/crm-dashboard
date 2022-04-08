import { ReactNode } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Loading, Header, Footer } from '../components/common';

const useStyles = makeStyles(() => ({
  header: {
    flex: '0 1 auto',
  },
  body: {
    minHeight: '100px',
  },
  footer: {
    flex: '0 1 auto',
  },
}));

interface MainProps {
  children: ReactNode
  header: boolean
  footer: boolean
  loading: boolean
}

export const MainLayout = ({
  loading, header, footer, children,
}: MainProps) => {
  const classes = useStyles();

  return (
    <div>
      {header ? <Header /> : null}

      {loading ? <Loading /> : null}

      <div className={classes.body}>{children}</div>
      {footer ? <Footer /> : null}
    </div>
  );
};
