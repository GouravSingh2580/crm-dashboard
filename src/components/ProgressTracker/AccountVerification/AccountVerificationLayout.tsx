import React from 'react';
import { Box, Grid, Stepper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useMediaBreakpoints } from 'hooks/useMediaBreakpoints';
import { ProgressTrackerStages, ProgressTrackerStatus } from 'services/account';
import { FormationsStep } from 'components/FormationsStep';
import { ENTITY_MAPPING } from 'constants/common';
import { UploadGovID } from './UploadGovID';
import { DirectDepositInfo } from './DirectDepositInfo';

const useStyle = makeStyles((theme) => ({
  stepContentWrapper: {
    [theme.breakpoints.up('md')]: {
      '& > div': {
        maxWidth: '546px',
      },
    },
  },
}));

const getSubtitleWithList = ({
  header,
  listItems,
  footer,
}: {
  header: string;
  listItems: string[];
  footer: string;
}) => (
  // eslint-disable-next-line react/jsx-indent
  <Box>
    <p>{header}</p>
    <ul>
      {listItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p>{footer}</p>
  </Box>
);

const getDOIOptionsByEntityType = (entityType: string) => {
  if (entityType === ENTITY_MAPPING.s_corp) {
    return [
      'Articles of incorporation',
      'EIN Letter',
      'Operating Agreement (optional)',
      'Letter of acceptance (2553) or 1120S',
    ];
  }
  return [
    'Articles of incorporation',
    'EIN Letter',
    'Operating Agreement (optional)',
  ];
};

const getTitleAndSubtitle = (
  status: ProgressTrackerStatus,
  data: { title: string; subtitle: string | React.ReactNode },
) => {
  if (status === ProgressTrackerStatus.InProgress) {
    return {
      title: 'We’re reviewing the documents you uploaded.',
      subtitle: "We'll update once approved.",
    };
  }

  if (status === ProgressTrackerStatus.Completed) {
    return {
      title: 'Your documents are approved',
      subtitle: '',
    };
  }

  return data;
};

const renderStepContent = (
  step: number,
  handleContinue: (stage: ProgressTrackerStages) => void,
  isLoading: boolean,
  accountId: string | undefined,
  state: any,
  entityType: string,
) => {
  const steps = Object.keys(state);
  const currentStatus = state[steps[step]]?.status;
  const comment = state[steps[step]]?.comment;
  switch (steps[step]) {
    case ProgressTrackerStages.UploadIdentityProof: {
      const titleAndSubtitle = getTitleAndSubtitle(currentStatus, {
        title: 'Proof of Identity',
        subtitle:
          "Please verify your identity by uploading front and back image of your Driver's License, State-Issued ID. (Acceptable file types: PNG, JPEG and PDF up to 5MB)",
      });
      return (
        <UploadGovID
          accountId={accountId}
          handleContinue={() =>
            handleContinue(ProgressTrackerStages.UploadIdentityProof)
          }
          isLoading={isLoading}
          currentStatus={currentStatus}
          {...titleAndSubtitle}
          categoryData={{
            name: 'Miscellaneous',
            subcategory: 'Biographical Information',
            department: 'Permanent',
          }}
          defaultYear="Permanent"
          comment={comment}
          key="kycComponent"
        />
      );
    }
    case ProgressTrackerStages.UploadLastYearTaxStatement: {
      const titleAndSubtitle = getTitleAndSubtitle(currentStatus, {
        title: "Upload Last Year's Tax Return",
        subtitle:
          'Please submit your last filed personal and or business tax return - Form 1040 and 1120s (Acceptable file types: PNG, JPEG and PDF up to 5MB)',
      });
      return (
        <UploadGovID
          accountId={accountId}
          handleContinue={() =>
            handleContinue(ProgressTrackerStages.UploadLastYearTaxStatement)
          }
          isLoading={isLoading}
          currentStatus={currentStatus}
          {...titleAndSubtitle}
          categoryData={{
            name: 'Business',
            subcategory: 'Tax Return',
            department: 'Tax',
          }}
          defaultYear="Permanent"
          comment={comment}
          key="taxComponent"
        />
      );
    }
    case ProgressTrackerStages.DocumentOfIncorporation: {
      const titleAndSubtitle = getTitleAndSubtitle(currentStatus, {
        title: 'Documents of Incorporation',
        subtitle: getSubtitleWithList({
          header: 'Please submit documents regarding Incorporation below.',
          listItems: getDOIOptionsByEntityType(entityType),
          footer: '(Acceptable file types: PNG, JPEG and PDF up to 5MB)',
        }),
      });
      return (
        <UploadGovID
          accountId={accountId}
          handleContinue={() =>
            handleContinue(ProgressTrackerStages.DocumentOfIncorporation)
          }
          isLoading={isLoading}
          currentStatus={currentStatus}
          {...titleAndSubtitle}
          categoryData={{
            name: 'Organizational Docs',
            subcategory: 'Miscellaneous',
            department: 'Permanent',
          }}
          defaultYear="Permanent"
          comment={comment}
          key="IncorporationComponent"
        />
      );
    }
    case ProgressTrackerStages.DirectDepositInformation:
      return (
        <DirectDepositInfo
          handleContinue={() =>
            handleContinue(ProgressTrackerStages.DirectDepositInformation)
          }
          currentStatus={currentStatus}
        />
      );
    default:
      return (
        <div>
          <Typography component="h2" variant="h5">
            We got your Account Information
          </Typography>
          <p>We’ll let you know in the next 2-7 days.</p>
        </div>
      );
  }
};

interface AccountVerificationProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  handleContinue: (stage: ProgressTrackerStages) => void;
  isLoading: boolean;
  accountId: string | undefined;
  state: any;
  entityType: string;
  ein: string | undefined;
}

export const AccountVerificationLayout = ({
  activeStep,
  setActiveStep,
  handleContinue,
  isLoading,
  accountId,
  state,
  entityType,
  ein,
}: AccountVerificationProps) => {
  const classes = useStyle();
  const { isDesktop } = useMediaBreakpoints();

  const steps = Object.keys(state);
  return (
    <Grid container spacing={{ md: 2 }}>
      <Grid item xs={12} md={5}>
        <Stepper
          activeStep={activeStep}
          nonLinear
          orientation={isDesktop ? 'vertical' : 'horizontal'}
          alternativeLabel={!isDesktop}
          data-test-id="account-verification-stages"
        >
          {steps.map((key, index) => (
            <FormationsStep
              key={key}
              index={index}
              setActiveStep={setActiveStep}
              status={state[key]?.status}
              label={state[key]?.label}
              isTrainer={false}
            />
          ))}
        </Stepper>
      </Grid>
      <Grid item xs={12} md={7} className={classes.stepContentWrapper}>
        <Box>
          {renderStepContent(
            activeStep,
            handleContinue,
            isLoading,
            accountId,
            state,
            entityType,
            ein,
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
