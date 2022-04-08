import React from 'react';
import {
  Step, StepButton, StepLabel, Typography,
} from '@mui/material';
import { ProgressTrackerStatus } from 'services/account';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { SECONDARY_COLOR, MAIN_COLOR } from 'theme/constant';
import { UIDateFormat } from 'helpers/dateTimeFormat';


const useStyle = makeStyles(() => ({
  root: {
    width: '20px',
    height: '20px',
    borderRadius: '50%'
  },
  button: {
    textAlign: 'left',
  },
  notStarted: {
    backgroundColor: MAIN_COLOR,
  },
  nonActionable: {
    backgroundColor: '#4493FB',
  },
  actionable: {
    backgroundColor: 'orange',
  },
  completed: {
    backgroundColor: SECONDARY_COLOR,
  },
}));

interface FormationsStepProps {
  key: string
  status: ProgressTrackerStatus
  index: number
  label: string
  setActiveStep: (step: number) => void
  isTrainer: boolean
  lastUpdatedTime?: string
}

export const FormationsStep = ({
  key,
  status,
  index,
  label,
  setActiveStep,
  isTrainer,
  lastUpdatedTime = '',
}: FormationsStepProps) => {
  const classes = useStyle();

  const CustomIcon = (props: any) => {
    const { classes: propClass } = props;
    return (
      <div className={clsx(classes.root, propClass.root)} />
    );
  };

  const getInfoBaseOnStatus = () => {
    switch (status) {
      case ProgressTrackerStatus.InProgress:
        if (isTrainer) {
          return {
            statusIcon: classes.actionable,
            text: 'Action Needed',
          };
        }
        return {
          statusIcon: classes.nonActionable,
          text: 'In Review',
        };
      case ProgressTrackerStatus.Started:
      case ProgressTrackerStatus.Rejected:
        if (isTrainer) {
          return {
            statusIcon: classes.nonActionable,
            text: 'Customer Action Needed',
          };
        }
        return {
          statusIcon: classes.actionable,
          text: 'Action Needed',
        };
      case ProgressTrackerStatus.Completed:
        return {
          statusIcon: classes.completed,
          text: 'Completed',
        };
      case ProgressTrackerStatus.NotStarted:
      default:
        return {
          statusIcon: classes.notStarted,
          text: '',
        };
    }
  }

  const { statusIcon, text } = getInfoBaseOnStatus();

  return (
    <Step
      key={key}
      index={index}
    >
      <StepButton
        className={classes.button}
        onClick={() => setActiveStep(index)}
        optional={<Typography variant="caption">{text}</Typography>}
        data-testid={`step-${label}`}
      >
        <StepLabel
          StepIconComponent={CustomIcon}
          StepIconProps={{
            classes: {
              root: statusIcon,
            }
          }}
        >
          <Typography variant="body2B">
            {label}
          </Typography>
          <Typography ml={1} variant="caption">
            {!!lastUpdatedTime &&
              UIDateFormat(lastUpdatedTime)}
          </Typography>
        </StepLabel>
      </StepButton>
    </Step>
  );
}
