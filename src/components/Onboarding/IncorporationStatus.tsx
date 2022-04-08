import { useEffect, useState } from 'react';
import { ReactComponent as FormationsDotsGrid } from 'icons/formations-dots-grid.svg';
import { Box, Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useMediaBreakpoints } from 'hooks';
import { ENTITY_MAPPING } from 'constants/common';
import { useCurrentCompany } from 'hooks/api/useCompanies';
import { Loading } from 'components/common';
import { OnboardingService } from 'services';
import { useHistory } from 'react-router-dom';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';
import queryClient from 'states/reactQueryClient';
import { Routes } from 'fnRoutes';
import { ArrowBack } from '@mui/icons-material';
import { EntitySelectionRadio } from 'components/common/EntitySelectionRadio';

const data = [
  {
    value: ENTITY_MAPPING.llc,
    label: 'LLC',
    secondaryLabel: 'Limited Liability Company',
    secondaryText: 'Combines features of both a corporation and a partnership.',
    icon: 'llc',
  },
  {
    value: ENTITY_MAPPING.s_corp,
    label: 'S-Corp',
    secondaryLabel: 'Small Business Establishments',
    secondaryText:
      'Passes income, losses, deductions, and credits to its shareholders.',
    icon: 's-corp',
  },
  {
    value: ENTITY_MAPPING.c_corp,
    label: 'C-Corp',
    secondaryLabel: 'C-Corporation',
    secondaryText:
      'Taxes owners and shareholders separately from the business.',
    icon: 'c-corp',
  },
];

const useStyles = makeStyles((theme) => ({
  question: {
    marginTop: theme.spacing(3),
  },
  dots: {
    marginTop: theme.spacing(20),
    marginLeft: theme.spacing(6),
    zIndex: '-1',
  },
  options: {},
  navigationControls: {
    marginTop: theme.spacing(4),
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  [theme.breakpoints.up('md')]: {
    question: {
      marginTop: theme.spacing(15),
    },
    dots: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(34),
      zIndex: '-1',
    },
    options: {
      marginTop: theme.spacing(15),
    },
    navigationControls: {
      position: 'absolute',
      marginTop: '0',
      top: '640px',
      right: 0,
    },
  },
}));

export const IncorporationStatus = () => {
  const classes = useStyles();
  const { isDesktop } = useMediaBreakpoints();
  const history = useHistory();
  const [selected, setSelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentCompany, status } = useCurrentCompany();

  const questionVariant = isDesktop ? 'h5B' : 'body2B';

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      await OnboardingService.createAndUpdateCompany({
        entityType: selected,
        legacyEntityType: selected,
      });
      sendProgressTrackerEvent({
        stage: 'EntitySelection',
        accountId: currentCompany?.accountId,
        entityType: selected,
      });
      queryClient
        .invalidateQueries('currentUser')
        .then(() => history.push(Routes.PROGRESS_TRACKER));
    } catch (errorSavingData) {
      sendProgressTrackerEvent({
        stage: 'EntitySelection',
        accountId: currentCompany?.accountId,
        entityType: selected,
        status: 'error',
      });
    } finally {
      window.localStorage.removeItem('businessType');
      setIsLoading(false);
    }
  };

  const goBack = () => history.push(Routes.ENTITY_SELECTION);

  useEffect(() => {
    if (currentCompany?.entityType) {
      history.push(Routes.PROGRESS_TRACKER);
    }
  }, [currentCompany, history]);

  useEffect(() => {
    const cachedBusinessType = window.localStorage.getItem('businessType');
    if (!cachedBusinessType) {
      goBack();
    }
  }, []);

  return status === 'success' || status === 'error' ? (
    <Grid container spacing={2}>
      {isLoading && <Loading />}
      <Grid item xs={12} md={3} className="left">
        <Typography
          component="p"
          variant={questionVariant}
          color="primary"
          className={classes.question}
          data-test-id="incorporation-status"
        >
          What is your current business structure?
        </Typography>
        {isDesktop && <FormationsDotsGrid className={classes.dots} />}
      </Grid>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          position: 'relative',
        }}
      >
        <Box className={classes.options}>
          <Grid container spacing={3}>
            {data.map((option) => (
              <Grid item md={4} key={option.value}>
                <EntitySelectionRadio
                  {...option}
                  onChange={setSelected}
                  selectedValue={selected}
                  isDesktop={isDesktop}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box className={classes.navigationControls}>
          <Button
            type="button"
            variant="text"
            size="large"
            startIcon={<ArrowBack />}
            onClick={goBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            data-Test-id="continue"
            className={classes.continue}
            disabled={!selected}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Grid>
    </Grid>
  ) : (
    <Loading />
  );
};
