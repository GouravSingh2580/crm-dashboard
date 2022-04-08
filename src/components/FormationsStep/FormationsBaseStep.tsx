import {
  Box,
  Step,
  StepButton,
  StepLabel,
  StepProps,
  Typography,
} from '@mui/material';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { MAIN_COLOR, SECONDARY_COLOR } from 'theme/constant';

const useStyle = makeStyles(() => ({
  root: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
  },
  button: {
    textAlign: 'left',
  },
  primary: {
    backgroundColor: MAIN_COLOR,
  },
  blue: {
    backgroundColor: '#4493FB',
  },
  orange: {
    backgroundColor: 'orange',
  },
  green: {
    backgroundColor: SECONDARY_COLOR,
  },
}));

type Color = 'gray' | 'green' | 'orange' | 'blue' | 'primary';

interface Props extends StepProps {
  color?: Color;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

const CustomIcon = ({ color }: { color: Color }) => {
  const colors = {
    gray: 'primary.border',
    primary: 'primary.main',
    orange: 'orange',
    blue: 'primary.light',
    green: 'secondary.main',
  };
  return (
    <Box
      sx={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: colors[color],
      }}
    />
  );
};

export const FormationsBaseStep = ({
  title,
  subtitle = '',
  index,
  onClick = () => {
    /* empty function */
  },
  color = 'primary',
}: Props) => {
  const classes = useStyle();
  return (
    <Step key={title} index={index}>
      <StepButton
        className={classes.button}
        onClick={onClick}
        optional={
          subtitle && <Typography variant="caption">{subtitle}</Typography>
        }
        data-testid={`step-${title}`}
      >
        <StepLabel
          StepIconComponent={CustomIcon}
          StepIconProps={{
            color,
          }}
        >
          <Typography variant="body2B">{title}</Typography>
        </StepLabel>
      </StepButton>
    </Step>
  );
};
