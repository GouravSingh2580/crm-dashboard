import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Stepper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormationsBaseStep } from 'components/FormationsStep';
import { useParams } from 'react-router-dom';
import { useAccountByUserId } from 'hooks/api';
import { PersonalTaxLiability } from './PersonalTaxLiability';

export const TaxLiability = () => {
  const { id } = useParams<{ id: string }>();
  const { account } = useAccountByUserId(id);
  return (
    <Box sx={{ mt: 4 }}>
      <Accordion data-testid="estimated-salary" expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="estimated-salary-content"
          id="estimated-salary-header"
        >
          <div>
            <Typography variant="h6B" data-testid="title">
              Tax Liability
            </Typography>
            <Typography variant="body2" fontWeight={400} sx={{ mt: 1 }}>
              Information provided here helps us determine the total amount of
              your personal tax Debt.
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
                  color={account?.taxes?.annualEstimated ? 'green' : undefined}
                />
              </Stepper>
            </Grid>
            <Grid item xs={12} md={7}>
              <PersonalTaxLiability
                accountId={account?.id}
                taxes={account?.taxes}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
