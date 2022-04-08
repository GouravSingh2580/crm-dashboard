import { useState, useEffect } from 'react';

import { CalculatorLayout } from 'layouts';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom';
import { useCalData, useSavedCalculatorState } from '../../states';
import { GetQueryParameterValue } from '../../hooks/useQueryParameters';
import { Dom } from '../../helpers';
import { HubspotService } from '../../services';
import { useContactId } from '../../hooks';
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
} from '../../components/calculator';
import { GetInTouchFooter } from '../../components/common';
import { Routes } from '../../fnRoutes';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getStepContent(prevStep, step, props) {
  /**
   * Send {...props} to each component which contains next and prev func.
   */
  switch (step) {
    case 0:
      return <Step1 {...props} />;
    case 1:
      return <Step2 {...props} />;
    case 2:
      return <Step3 {...props} />;
    case 3:
      return <Step4 {...props} />;
    case 4:
      return <Step5 {...props} />;
    case 5:
      return <Step6 {...props} prevStep={prevStep} />;
    case 6:
      return <Step7 {...props} />;
    case 7:
      return <Step8 {...props} />;
    case 8:
      return <Step9 {...props} />;
    default:
      return 'Unknown step';
  }
}

export function Calculator() {
  const contactId = GetQueryParameterValue('hs_cid');
  const { contactId: internalStoredId } = useContactId();
  const { data: calData } = useCalData();
  const { persistedData, persist, reset } = useSavedCalculatorState();
  const classes = useStyles();
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

  async function checkInternalData() {
    try {
      const internalId = await HubspotService.getHubSpotInternalId(
        contactId,
      );

      if (internalId === internalStoredId) {
        history.push(
          {
            pathname: Routes.CALCULATOR_RESULT,
          },
          {
            contactId,
          },
        );
      } else {
        reset();
      }
    } catch (internalIdErr) {
      reset();
    }
  }

  useEffect(() => {
    if (persistedData && Object.keys(persistedData).length > 0) {
      checkInternalData();
    }
  }, [persistedData]);

  useEffect(() => {
    if (activeStep === 9) {
      persist(calData);
      history.push(
        {
          pathname: Routes.CALCULATOR_RESULT,
        },
        {
          contactId,
        },
      );
    }
  }, [activeStep, history]);

  const handleNext = () => {
    Dom.goToTop();
    setPrevStep(activeStep);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    Dom.goToTop();
    setPrevStep(activeStep);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <CalculatorLayout header footer showLogo={false}>
      <div className={classes.root}>
        <div>
          <Typography className={classes.instructions} component="div">
            {getStepContent(prevStep, activeStep, { handleNext, handleBack })}
          </Typography>
        </div>
      </div>
      <GetInTouchFooter />
    </CalculatorLayout>
  );
}
