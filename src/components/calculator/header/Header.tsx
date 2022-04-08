import * as React from 'react';
import { Typography } from '@mui/material';
import { FormationsDivider } from 'components/common';

export const Header = () => (
  <div>
    <Typography data-testid="calculator_header" variant="h4" component="h1">
      🔢 Calculator
    </Typography>
    <FormationsDivider />
  </div>
);
