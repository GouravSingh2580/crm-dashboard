import { useEffect, useState } from 'react';
import { AuthService } from '../services';
import { CONSTANTS } from '../constants/common';

function useTermsAndConditionsConsent() {
  const [acceptedLatestTerms, setAcceptedLatestTerms] = useState<boolean>();

  useEffect(() => {
    (async () => {
      let lastAcceptedVersion = AuthService.userConsent();
      if (lastAcceptedVersion === undefined) {
        await AuthService.refresh();
        lastAcceptedVersion = AuthService.userConsent();
      }
      if (AuthService.isCustomer() && new Date(lastAcceptedVersion).getTime()
        >= new Date(CONSTANTS.TERM_AND_CONDITION_VERSION).getTime()) {
        setAcceptedLatestTerms(true);
      } else {
        setAcceptedLatestTerms(false);
      }
    })();
  }, []);

  return {
    acceptedLatestTerms,
  };
}

export default useTermsAndConditionsConsent;
