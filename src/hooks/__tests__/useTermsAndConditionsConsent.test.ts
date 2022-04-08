import { renderHook } from '@testing-library/react-hooks';
import { AuthService } from '../../services';
import Api from '../../services/axios';
import { CONSTANTS } from '../../constants/common';
import useTermsAndConditionsConsent from '../useTermsAndConditionsConsent';

describe('useTermsAndConditionsConsent tests', () => {
  const user = {
    id: '123',
    email: 'abc@example.com',
    stage: 'Registered',
    role: 'Customer',
    lastAcceptedVersion: '2021-09-05',
  };

  jest.mock('../../services/axios');

  afterEach(() => {
    AuthService.clearAllData();
  });

  it('should provide acceptedLatestTerms === false', async () => {
    Api.get = jest.fn().mockResolvedValue({
      data: { data: user },
    });
    const { result, waitForNextUpdate } = renderHook(useTermsAndConditionsConsent);
    expect(result.current.acceptedLatestTerms).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current.acceptedLatestTerms).toEqual(false);
  });

  it('should provide acceptedLatestTerms === true', async () => {
    user.lastAcceptedVersion = CONSTANTS.TERM_AND_CONDITION_VERSION;
    Api.get = jest.fn().mockResolvedValue({
      data: { data: user },
    });
    const { result, waitForNextUpdate } = renderHook(useTermsAndConditionsConsent);
    expect(result.current.acceptedLatestTerms).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current.acceptedLatestTerms).toEqual(true);
  });

  it('should provide acceptedLatestTerms === false. if user type is Admin', async () => {
    user.lastAcceptedVersion = CONSTANTS.TERM_AND_CONDITION_VERSION;
    user.role = 'Admin';
    Api.get = jest.fn().mockResolvedValue({
      data: { data: user },
    });
    const { result, waitForNextUpdate } = renderHook(useTermsAndConditionsConsent);
    expect(result.current.acceptedLatestTerms).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current.acceptedLatestTerms).toEqual(false);
  });
});
