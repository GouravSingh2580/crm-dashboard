import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  Stepper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormationsBaseStep } from 'components/FormationsStep';
import { Compensation } from './Compensation';
import { Overview } from './Overview';

export const EstimatedSalary = () => (
  <Box sx={{ mt: 4 }}>
    <Accordion data-testid="estimated-salary" expanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="estimated-salary-content"
        id="estimated-salary-header"
      >
        <div>
          <Typography variant="h6B">Payroll</Typography>
          <Typography variant="body2" fontWeight={400} sx={{ mt: 1 }}>
            These details will help us verify your personal and business
            information, to help you set up your account faster.
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12} md={5}>
            <Stepper
              activeStep={0}
              nonLinear
              orientation="vertical"
              alternativeLabel={false}
              data-test-id="estimate-salary-step"
            >
              <FormationsBaseStep
                title="Business Owner"
                color="green"
              />
            </Stepper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Compensation />
            <Divider sx={{ mt: 3, mb: 3 }} />
            <Overview />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  </Box>
);
