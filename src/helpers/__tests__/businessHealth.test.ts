import moment from 'moment';
import { formatDate } from 'helpers/dateTimeFormat';
import {
  HEALTH_SCORE_MAPPING,
  RENEW_DATE_WARMING,
  getStatusFromScore,
  getIconStatusCustomerDiscussion,
  checkIncorporationStatus,
  checkIncorporationRenewStatus,
} from '../businessHealth';

describe('Business Health logic calculation test', () => {
  it('Testing icon status from Score.', () => {
    expect(getStatusFromScore(HEALTH_SCORE_MAPPING.excellent)).toBe('green');
    expect(getStatusFromScore(5)).toBe('yellow');
    expect(getStatusFromScore(0)).toBe('red');
  });

  it('Testing icon status from CustomerDiscussionStatus.', () => {
    expect(getIconStatusCustomerDiscussion('yes')).toBe('green');
    expect(getIconStatusCustomerDiscussion('decline')).toBe('green');
    expect(getIconStatusCustomerDiscussion('todo')).toBe('yellow');
  });

  it('Testing incorporation status logic.', () => {
    const undefinedRenewalDate = undefined;
    const pastDate = formatDate(moment().subtract(1, 'd'));
    const futureDate = formatDate(moment().add(1, 'd'));
    expect(checkIncorporationStatus(undefinedRenewalDate)).toBe(
      HEALTH_SCORE_MAPPING.excellent,
    );
    expect(checkIncorporationStatus(pastDate)).toBe(HEALTH_SCORE_MAPPING.poor);
    expect(checkIncorporationStatus(futureDate)).toBe(
      HEALTH_SCORE_MAPPING.excellent,
    );
  });

  it('Testing incorporation renewal date logic customer.', () => {
    const undefinedRenewalDate = undefined;
    const pastDate = moment().subtract(2, 'd');
    const expireSoonDate = moment().add(2, 'd');
    const futureDate = moment().add(RENEW_DATE_WARMING + 2, 'd');
    expect(checkIncorporationRenewStatus(undefinedRenewalDate)).toBe(
      HEALTH_SCORE_MAPPING.excellent,
    );
    expect(checkIncorporationRenewStatus(pastDate)).toBe(
      HEALTH_SCORE_MAPPING.poor,
    );
    expect(checkIncorporationRenewStatus(expireSoonDate)).toBe(
      HEALTH_SCORE_MAPPING.fair,
    );
    expect(checkIncorporationRenewStatus(futureDate)).toBe(
      HEALTH_SCORE_MAPPING.excellent,
    );
  });

  it('Testing incorporation renewal date logic admin.', () => {
    const undefinedRenewalDate = undefined;
    const pastDate = moment().subtract(2, 'd');
    const expireSoonDate = moment().add(2, 'd');
    const futureDate = moment().add(RENEW_DATE_WARMING + 2, 'd');
    expect(checkIncorporationRenewStatus(undefinedRenewalDate, true)).toBe(
      HEALTH_SCORE_MAPPING.poor,
    );
    expect(checkIncorporationRenewStatus(pastDate, true)).toBe(
      HEALTH_SCORE_MAPPING.poor,
    );
    expect(checkIncorporationRenewStatus(expireSoonDate, true)).toBe(
      HEALTH_SCORE_MAPPING.fair,
    );
    expect(checkIncorporationRenewStatus(futureDate, true)).toBe(
      HEALTH_SCORE_MAPPING.excellent,
    );
  });
});
