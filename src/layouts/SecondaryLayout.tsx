import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Header } from '../components/common';

const useStyles = makeStyles((theme) => ({
  page: {
    backgroundColor: theme.palette.onboardingBackground.main,
  },
}));
interface SecondaryLayoutProps {
  children: ReactNode
}

export const SecondaryLayout = ({ children }: SecondaryLayoutProps) => {
  const classes = useStyles();

  return (
    <div id="page" className={classes.page}>
      <div>
        <Header />
      </div>
      <Container maxWidth="lg">{children}</Container>
    </div>
  );
};

SecondaryLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

