import {
  Box, Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useCurrentUser } from 'hooks/api';
import { Incorporation } from 'components/ProgressTracker/Incorporation';
import { BankSetup } from 'components/ProgressTracker/BankSetup';
import { Routes } from 'fnRoutes';
import { useMediaBreakpoints } from 'hooks';
import { AccountVerificationComponent } from 'components/ProgressTracker/AccountVerification/AccountVerificationComponent';

export const ProgressTracker = () => {
  const { isMobile, isDesktop } = useMediaBreakpoints();
  const history = useHistory();
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser && !currentUser.companyId) {
      history.push(`${Routes.ENTITY_SELECTION}`);
    }
  }, [currentUser, history]);

  return (
    <Box
      sx={{
        width: isMobile ? 'auto' : '100%',
        p: isMobile ? 2 : 7,
        paddingBottom: 7,
      }}
    >
      <Typography
        component="h4"
        variant="h4"
        sx={{
          marginBottom: isMobile ? 2 : 4,
        }}
      >
        Welcome on board!
      </Typography>
      <Incorporation isDesktop={isDesktop} />
      <AccountVerificationComponent />
      <BankSetup isDesktop={isDesktop} />
    </Box>
  );
};
