import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/system';
import { AccountService } from 'services';
import { FLAGS, useFeatureFlag } from 'hooks/useFeatureFlag';
import useUserData from 'hooks/useUserData';
import { logForDataMissing } from 'helpers/businessHealth';
import { Routes } from 'fnRoutes';
import { BusinessHealth } from './businessHealth/BusinessHealth';
import { XeroConnection } from '../xeroConnection';
import { CustomerTaxLiability } from './CustomerTaxLiability';
import { FinancialOverview } from './financialOverview/FinancialOverview';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    margin: theme.spacing(4, 7),
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  userInfoContainer: {
    marginBottom: theme.spacing(4),
  },
  healthContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 335,
  },
}));

export const Insight = () => {
  const history = useHistory();
  const { data: userData, remove } = useUserData();
  const classes = useStyles();

  const isFeatureFlagEnabled = useFeatureFlag(FLAGS.XERO_CONNECTION);
  useEffect(() => {
    const check = async () => {
      if (userData) {
        const accountResp = await AccountService.getAccount(
          userData.userInfo.accountId || '',
        );
        if (accountResp.status.label === 'NEW') {
          if (!userData.isEntityFilled()) {
            // remove user Data caching becuse user doesn't have company yet
            remove();
            // redirect to old onboarding for entity select
            history.push(Routes.ENTITY_SELECTION);
          } else {
            // redirect to new progress tracker
            logForDataMissing(userData); // log if user data is not complete
            history.push(`${Routes.PROGRESS_TRACKER}/`);
          }
        }
      }
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div className={classes.pageContainer}>
      <Grid container spacing={2}>
        <Grid item md={12} sx={{ marginBottom: '48px' }}>
          <Typography variant="h7B" className={classes.userInfoContainer}>
            {`Hi ${userData?.userInfo?.name?.first}!`}
          </Typography>
          {isFeatureFlagEnabled && <XeroConnection />}
        </Grid>
        <Grid item container xs={12} md={4}>
          <Grid item xs='auto'>
            <BusinessHealth />
          </Grid>
          <Grid item xs>
            <FinancialOverview />
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h8B">Tax payment progress</Typography>
            <CustomerTaxLiability />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};
