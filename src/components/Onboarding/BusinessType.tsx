import { useEffect, useState } from 'react';
import { ReactComponent as FormationsDotsGrid } from 'icons/formations-dots-grid.svg';
import { Box, Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useMediaBreakpoints } from 'hooks';
import { EntitySelectionRadio } from 'components/common/EntitySelectionRadio';
import { useHistory } from 'react-router-dom';
import { useCurrentCompany } from 'hooks/api/useCompanies';
import queryClient from 'states/reactQueryClient';
import { Routes } from 'fnRoutes';
import { OnboardingService } from 'services';
import { ENTITY_MAPPING } from 'constants/common';
import { Loading } from 'components/common';
import { sendProgressTrackerEvent } from 'helpers/heap/progressTrackerEvent';

const data = [
  {
    value: 'not-incorporated',
    label: 'Not Incorporated',
    secondaryText:
      'Business owned and run by one individual that is not yet incorporated',
    icon: 'not-incorporated',
  },
  {
    value: 'incorporated',
    label: 'Incorporated',
    secondaryText:
      'An entity that is already incorporated and is an actively running business',
    icon: 'incorporated',
  },
];

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(3),
  },
  subTitle: {
    marginTop: theme.spacing(2),
  },
  question: {
    marginTop: theme.spacing(2),
  },
  options: {},
  navigationControls: {
    marginTop: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    title: {
      marginTop: theme.spacing(15),
    },
    subTitle: {
      marginTop: theme.spacing(6),
      maxWidth: `396px`,
    },
    question: {
      marginTop: theme.spacing(6),
    },
    dots: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(5),
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
    continue: {
      float: 'right',
    },
  },
}));

const getTypograhyVariants = (isDesktop: boolean) => {
  let titleVariant = 'subtitle1LT';
  let subTitleVariant = 'body2';
  let questionVariant = 'body2B';
  if (isDesktop) {
    titleVariant = 'h4';
    subTitleVariant = 'subtitle1L';
    questionVariant = 'h5B';
  }
  return {
    titleVariant,
    subTitleVariant,
    questionVariant,
  };
};

export const BusinessType = () => {
  const classes = useStyles();
  const { isDesktop } = useMediaBreakpoints();
  const history = useHistory();
  const [selected, setSelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentCompany, status } = useCurrentCompany();

  const { titleVariant, subTitleVariant, questionVariant } =
    getTypograhyVariants(isDesktop);

  const handleContinue = async () => {
    sendProgressTrackerEvent({
      stage: 'IncorporationStatus',
      incorporationExists: selected === 'incorporated' ? 'Yes' : 'No',
      accountId: currentCompany?.accountId,
      entityType: selected === 'incorporated' ? ENTITY_MAPPING.sole_prop : '',
    });
    if (selected === 'incorporated') {
      window.localStorage.setItem('businessType', selected);
      history.push('/onboarding/incorporation-status');
    } else {
      // if not incorporated then entity type is sole_prop
      try {
        setIsLoading(true);
        await OnboardingService.createAndUpdateCompany({
          entityType: ENTITY_MAPPING.sole_prop,
          legacyEntityType: ENTITY_MAPPING.sole_prop,
        });
        sendProgressTrackerEvent({
          stage: 'EntitySelection',
          accountId: currentCompany?.accountId,
          entityType: ENTITY_MAPPING.sole_prop,
        });
        queryClient
          .invalidateQueries('currentUser')
          .then(() => history.push(Routes.PROGRESS_TRACKER));
      } catch (errorSavingData) {
        sendProgressTrackerEvent({
          stage: 'EntitySelection',
          accountId: currentCompany?.accountId,
          entityType: ENTITY_MAPPING.sole_prop,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentCompany?.entityType) {
      history.push(Routes.PROGRESS_TRACKER);
    }
  }, [currentCompany, history]);

  useEffect(() => {
    const cachedBusinessType = window.localStorage.getItem('businessType');
    if (cachedBusinessType) {
      setSelected(cachedBusinessType);
    }
  }, []);

  return ['success', 'error'].includes(status) ? (
    <Grid container spacing={2}>
      {isLoading && <Loading />}
      <Grid item xs={12} md={6} className="left">
        <Typography
          component="h4"
          variant={titleVariant}
          color="primary"
          className={classes.title}
        >
          Welcome aboard
        </Typography>
        <Typography
          component="p"
          variant={subTitleVariant}
          color="primary"
          className={classes.subTitle}
          data-test-id="business-type"
        >
          We&apos;re happy you&apos;re here. Before we kick off the onboarding
          process, tell us about your current business structure.
        </Typography>
        <Typography
          component="p"
          variant={questionVariant}
          color="primary"
          className={classes.question}
        >
          Is your business incorporated?
        </Typography>
        {isDesktop && <FormationsDotsGrid className={classes.dots} />}
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: 'relative',
        }}
      >
        <Box className={classes.options}>
          <Grid container spacing={3}>
            {data.map((option) => (
              <Grid item md={6} key={option.value} sx={{ width: '100%' }}>
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
            variant="contained"
            color="secondary"
            size="large"
            data-test-id="continue"
            className={classes.continue}
            fullWidth={!isDesktop}
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
