import {
  COMPLETION_STATUS,
  HEALTH_INSURANCE_OPTION,
  RETIREMENT_PLAN_LIST,
  RETIREMENT_PROGRAM_OPTION,
  VENDOR_1099_OPTION,
} from 'enums/taxSurveyOptions';
import { isEmpty } from 'lodash';
import Api, { AxiosResponse } from './axios';

interface TaxSurveyResult {
  data: TaxSurveyData;
}

export interface TaxSurveyData {
  id: string;
  completionStatus: COMPLETION_STATUS;
  filingStatus?: string;
  additionalIncome?: string;
  annualHouseholdIncome?: string;
  taxesPaidForCurrentYear?: boolean;
  currentYearFederalTaxAmount?: string;
  currentYearStateTaxAmount?: string;
  healthInsuranceOption?: HEALTH_INSURANCE_OPTION;
  paidHealthInsuranceThroughBusiness?: boolean;
  totalInsurancePaymentAmount?: string;
  vendorsFor1099s?: VENDOR_1099_OPTION;
  businessRetirementProgramExists?: RETIREMENT_PROGRAM_OPTION;
  currentBusinessRetirementPlans?: {
    selections: RETIREMENT_PLAN_LIST[];
    other: string;
  };
  totalRetirementContributions?: string;
  targetRetirementContributions?: string;
}

export const getTaxSurveyDataByUserId = async (
  userId: string,
): Promise<TaxSurveyData> => {
  const { data }: AxiosResponse<TaxSurveyResult> = await Api.get(
    `tax-liability/${userId}`,
  );
  return data.data;
};

export const upsertTaxSurveyDataForUser = async (
  userId: string,
  params: TaxSurveyData,
) => {
  const reqBody: any = {};
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'boolean' || !isEmpty(value)) {
      reqBody[key] = value;
    } else {
      reqBody[key] = null;
    }
  });
  reqBody.userId = userId;
  await Api.post('tax-liability', reqBody);
};
