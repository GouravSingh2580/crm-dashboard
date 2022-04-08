import moment, { Moment } from 'moment';
import { Category, logInfo } from 'helpers/sentry';
import { CustomerDiscussionStatus, IAccount } from 'models/account';
import { Company } from 'models/company';
import { IconStatusType, IHealthStatus } from 'models/insight';
import UserData from 'models/UserData';
import healthGoodImage from 'icons/insight/healthGood.png';
import healthExcellentImage from 'icons/insight/healthExcellent.png';
import healthFairImage from 'icons/insight/healthFair.png';
import healthAttentionImage from 'icons/insight/healthAttention.png';

export const HEALTH_SCORE_MAPPING = {
  excellent: 10, // 10
  good: 7, // 7-9
  fair: 4, // 4-6
  poor: 0, // 0-3
};

export const STATUS_TEXT_MAPPING = {
  active: 'Active',
  inactive: 'Inactive',
};

export const RENEW_DATE_WARMING = 45; // renewal reminder date

export const logForDataMissing = (userData: UserData) => {
  const steps = {
    isUserDataFilled: userData.isUserDataFilled(),
    isCompanyDataFilled: userData.isCompanyDataFilled(),
    isCompanyAddressDataFilled: userData.isCompanyAddressDataFilled(),
    isCompanyBankDetailsFilled: userData.isCompanyBankDetailsFilled(),
    isUserDirectDepositInfoFilled: userData.isUserDirectDepositInfoFilled(),
    isKYCDocumentFilled: userData.isKYCDocumentFilled(),
  };
  logInfo({
    category: Category.OnBoarding,
    message: `user data check: ${JSON.stringify(steps)}`,
  });
};

export const getStatusFromScore = (score: number): IconStatusType => {
  if (score < HEALTH_SCORE_MAPPING.fair) {
    return 'red';
  }
  if (score < HEALTH_SCORE_MAPPING.good) {
    return 'yellow';
  }
  return 'green';
};

export const mapCustomerDiscussionStatusToString = (
  status: CustomerDiscussionStatus,
): string => {
  switch (status) {
    case 'yes':
      return 'Yes';
    case 'decline':
      return 'No – not interested';
    case 'todo':
    default:
      return 'No – yet to discuss';
  }
};

export const getIconStatusCustomerDiscussion = (
  status: CustomerDiscussionStatus,
): IconStatusType => {
  switch (status) {
    case 'yes':
    case 'decline':
      return getStatusFromScore(HEALTH_SCORE_MAPPING.excellent);

    case 'todo':
    default:
      return getStatusFromScore(HEALTH_SCORE_MAPPING.fair);
  }
};

export const checkIncorporationStatus = (
  incorporationRenewalDate?: string,
): number => {
  if (incorporationRenewalDate) {
    return moment(incorporationRenewalDate).isSameOrAfter(moment())
      ? HEALTH_SCORE_MAPPING.excellent
      : HEALTH_SCORE_MAPPING.poor;
  }
  // not yet entered by csm, does not effect health score
  return HEALTH_SCORE_MAPPING.excellent;
};

export const checkIncorporationStatusText = (
  incorporationRenewalDate?: string,
): string => {
  if (incorporationRenewalDate) {
    return moment(incorporationRenewalDate).isSameOrAfter(moment())
      ? STATUS_TEXT_MAPPING.active
      : STATUS_TEXT_MAPPING.inactive;
  }
  // not yet entered by csm
  return STATUS_TEXT_MAPPING.active;
};

// todo: waiting for api
// Connected (green),
// Disconnected Bank name (red)
// If no bank connected - hidden (does not effect health, hence score HEALTH_SCORE_MAPPING.excellent)
const checkBankConnectionStatus = (bankAccountNames: string): number =>
  bankAccountNames ? HEALTH_SCORE_MAPPING.excellent : HEALTH_SCORE_MAPPING.poor;

// todo: waiting for api
// Up-to-date (green),
// Uncategorized transactions (orange),
// Transactions from <Bank name> unavailable (red)
// If no bank connected - hidden (does not effect health, hence score HEALTH_SCORE_MAPPING.excellent)
const checkTransactionCategorizationStatus = (
  bankAccountNames: string,
): number =>
  bankAccountNames ? HEALTH_SCORE_MAPPING.excellent : HEALTH_SCORE_MAPPING.poor;

// always green as both in progress or renewes show green
const checkBookOfBusinessStatus = (): number => HEALTH_SCORE_MAPPING.excellent;

export const checkIncorporationRenewStatus = (
  incorporationRenewalDate?: string | Moment,
  isAdmin?: boolean,
): number => {
  if (incorporationRenewalDate) {
    const now = moment();
    const renewDate = moment(incorporationRenewalDate);
    const diffInDay = renewDate.diff(now, 'days');
    if (diffInDay > RENEW_DATE_WARMING) {
      return HEALTH_SCORE_MAPPING.excellent;
    }
    if (diffInDay > 0) {
      return HEALTH_SCORE_MAPPING.fair;
    }
    return HEALTH_SCORE_MAPPING.poor;
  }
  // not yet entered by csm, does not effect health score if is is customer, if csm viewing, show as red
  return isAdmin ? HEALTH_SCORE_MAPPING.poor : HEALTH_SCORE_MAPPING.excellent;
};

export const checkAdminIncorporationRenewStatus = (
  incorporationRenewalDate?: string | Moment,
  incorporationDate?: string | Moment,
): number => {
  if (incorporationDate) {
    return checkIncorporationRenewStatus(incorporationRenewalDate, true);
  }
  // incorporation date not yet entered by csm, show as red
  return HEALTH_SCORE_MAPPING.poor;
};

export const getAdminIncorporationStatusByScore = (score: number): string => {
  if (score < HEALTH_SCORE_MAPPING.fair) {
    return STATUS_TEXT_MAPPING.inactive;
  }
  return STATUS_TEXT_MAPPING.active;
};

export const checkPayrollEnabledStatus = (payrollEnabled?: boolean): number =>
  payrollEnabled ? HEALTH_SCORE_MAPPING.excellent : HEALTH_SCORE_MAPPING.good;

const checkHealthInsuranceStatus = (
  healthInsurance: CustomerDiscussionStatus,
): number =>
  healthInsurance === 'todo'
    ? HEALTH_SCORE_MAPPING.good
    : HEALTH_SCORE_MAPPING.excellent;

const checkRetirementPlanStatus = (
  retirementPlan: CustomerDiscussionStatus,
): number =>
  retirementPlan === 'todo'
    ? HEALTH_SCORE_MAPPING.good
    : HEALTH_SCORE_MAPPING.excellent;

export const getGenericHealth = (
  currentAccount?: IAccount,
  currentCompany?: Company,
  isAdmin?: boolean,
): {
  imageSrc: string;
  healthText: string;
  adminHealthText: string;
  score: number;
} => {
  const { bankAccountNames = '-', incorporationRenewalDate } =
    currentCompany || {};
  const {
    payrollEnabled,
    healthInsurance = 'todo',
    retirementPlan = 'todo',
  } = currentAccount || {};
  const healthNumber = Math.min(
    checkIncorporationStatus(incorporationRenewalDate),
    checkBankConnectionStatus(bankAccountNames),
    checkTransactionCategorizationStatus(bankAccountNames),
    checkBookOfBusinessStatus(),
    checkIncorporationRenewStatus(incorporationRenewalDate, isAdmin),
    checkPayrollEnabledStatus(payrollEnabled),
    checkHealthInsuranceStatus(healthInsurance),
    checkRetirementPlanStatus(retirementPlan),
  );

  if (healthNumber < HEALTH_SCORE_MAPPING.fair) {
    return {
      imageSrc: healthAttentionImage,
      healthText: 'Action Needed',
      adminHealthText: 'Action Needed',
      score: healthNumber,
    };
  }
  if (healthNumber < HEALTH_SCORE_MAPPING.good) {
    return {
      imageSrc: healthFairImage,
      healthText: 'Fair',
      adminHealthText: 'Fair',
      score: healthNumber,
    };
  }
  if (healthNumber < HEALTH_SCORE_MAPPING.excellent) {
    return {
      imageSrc: healthGoodImage,
      healthText: 'Good',
      adminHealthText: 'Good',
      score: healthNumber,
    };
  }
  return {
    imageSrc: healthExcellentImage,
    healthText: 'Excellent',
    adminHealthText: 'Excellent',
    score: healthNumber,
  };
};

export const getPayRollStatus = (payrollEnabled: boolean): IconStatusType =>
  payrollEnabled ? 'green' : 'yellow';

const getPayRollStatusText = (payrollEnabled: boolean): string =>
  payrollEnabled ? 'Yes' : 'No';

export const getHealthStatusList = (
  currentAccount?: IAccount,
): IHealthStatus[] => {
  const {
    payrollEnabled = false,
    healthInsurance = 'todo',
    retirementPlan = 'todo',
  } = currentAccount || {};

  const res: IHealthStatus[] = [];
  // todo in book status ticket as this is automatic field that requires additional server logic
  // if (bookStatus !== undefined) {
  //   res.push({
  //     status: getStatusFromScore(bookStatus),
  //     title: 'Transaction Categorization',
  //     description: '8 Uncategorized',
  //   });
  //   res.push({
  //     status: getStatusFromScore(bookStatus),
  //     title: 'Bookkeeping Status',
  //     description: 'Up to date',
  //   });
  // }
  res.push({
    status: getIconStatusCustomerDiscussion(retirementPlan),
    title: 'Retirement Plan Through Business',
    description: mapCustomerDiscussionStatusToString(retirementPlan),
  });

  // Do not display in customer view only if the value is No - Not interested
  if (healthInsurance !== 'decline') {
    res.push({
      status: getIconStatusCustomerDiscussion(healthInsurance),
      title: 'Health Insurance Through Business',
      description: mapCustomerDiscussionStatusToString(healthInsurance),
    });
  }

  res.push({
    status: getPayRollStatus(payrollEnabled),
    title: 'Payroll Auto-pilot Enabled',
    description: getPayRollStatusText(payrollEnabled),
  });

  return res;
};
