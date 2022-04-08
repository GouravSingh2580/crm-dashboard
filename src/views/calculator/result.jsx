import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useSavedCalculatorState } from 'states';
import { Routes } from 'fnRoutes';
import { useContactId } from '../../hooks';
import { HubspotService } from '../../services/hubspot';
import analysisService from '../../services/analysisService';
import { ResultDesktop, ResultMobile } from '../../components/calculator';
import { MainLayout } from '../../layouts';

const ResultView = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { saveContactId, contactId } = useContactId();
  const [finalCalculations, setFinalCalculations] = useState();
  const { reset, persistedData } = useSavedCalculatorState();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const ComponentView = (props) => (isSmallScreen ? (
    <ResultMobile {...props} />
  ) : (
    <ResultDesktop {...props} />
  ));

  useEffect(() => {
    if (persistedData && Object.keys(persistedData).length > 0) {
      if (state && state.contactId) {
        HubspotService
          .updateContactProperties(persistedData, state.contactId, false)
          .then((data) => {
            const { contactId: contactIdServer } = data;
            saveContactId(contactIdServer);
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (contactId) {
        HubspotService
          .updateContactProperties(persistedData, contactId, true)
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [state, persistedData]);

  async function getAnalysis() {
    const finalVal = await analysisService.analysis(persistedData);
    setFinalCalculations(finalVal);
  }

  useEffect(() => {
    if (persistedData && Object.keys(persistedData).length > 0) {
      getAnalysis();
    } else {
      /**
       * Clear all and redirect to /calculator
       */
      reset();
      history.replace({
        pathname: Routes.CALCULATOR,
      });
    }
  }, [persistedData]);

  return (
    <MainLayout>
      {finalCalculations && (
        <ComponentView
          report={finalCalculations}
          onReanalyze={() => reset({ all: false })}
          results={persistedData}
        />
      )}
    </MainLayout>
  );
};

export default ResultView
