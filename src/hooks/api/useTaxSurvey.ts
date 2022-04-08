import { useMutation, useQuery } from 'react-query';
import { COMPLETION_STATUS } from 'enums/taxSurveyOptions';
import queryClient from 'states/reactQueryClient';
import { TaxSurveyService } from '../../services';

const TAX_SURVEY_IDENT = 'taxSurvey';

const formatTaxSurveyData = (
  data: TaxSurveyService.TaxSurveyData,
): TaxSurveyService.TaxSurveyData => {
  const undefinedToEmptyStr = (v: any) => (v === undefined ? '' : v);
  const undefinedToNull = (v: any) => (v === undefined ? null : v);
  return {
    id: data.id,
    completionStatus: data.completionStatus,
    filingStatus: undefinedToEmptyStr(data.filingStatus),
    additionalIncome: undefinedToEmptyStr(data.additionalIncome),
    annualHouseholdIncome: undefinedToEmptyStr(data.annualHouseholdIncome),
    taxesPaidForCurrentYear: undefinedToNull(data.taxesPaidForCurrentYear),
    currentYearFederalTaxAmount: undefinedToEmptyStr(data.currentYearFederalTaxAmount),
    currentYearStateTaxAmount: undefinedToEmptyStr(data.currentYearStateTaxAmount),
    healthInsuranceOption: undefinedToEmptyStr(data.healthInsuranceOption),
    paidHealthInsuranceThroughBusiness: undefinedToNull(
      data.paidHealthInsuranceThroughBusiness,
    ),
    totalInsurancePaymentAmount: undefinedToEmptyStr(data.totalInsurancePaymentAmount),
    vendorsFor1099s: undefinedToEmptyStr(data.vendorsFor1099s),
    businessRetirementProgramExists: undefinedToEmptyStr(data.businessRetirementProgramExists),
    currentBusinessRetirementPlans: undefinedToNull(data.currentBusinessRetirementPlans),
    totalRetirementContributions: undefinedToEmptyStr(data.totalRetirementContributions),
    targetRetirementContributions: undefinedToEmptyStr(data.targetRetirementContributions),
  };
};

const emptyTaxSurveyData: TaxSurveyService.TaxSurveyData = formatTaxSurveyData({
  id: '',
  completionStatus: COMPLETION_STATUS.NO_INFORMATION,
});

export const getTaxSurveyByUserId = async (userId: string) => {
  if (!userId) {
    return emptyTaxSurveyData;
  }
  try {
    const result = await TaxSurveyService.getTaxSurveyDataByUserId(userId);
    return formatTaxSurveyData(result);
  } catch (err: any) {
    console.log(err);
  }
  return emptyTaxSurveyData;
};

export const upsertTaxSurveyDataForUser = async (
  userId: string,
  data: TaxSurveyService.TaxSurveyData,
) => {
  const result = await TaxSurveyService.upsertTaxSurveyDataForUser(
    userId,
    data,
  );
  queryClient.invalidateQueries([TAX_SURVEY_IDENT, userId]);
  return result;
};

const taxSurvey = {
  GetTaxSurveyDataForUser: (userId: string) => useQuery<
  TaxSurveyService.TaxSurveyData, unknown>(
    [TAX_SURVEY_IDENT, userId],
    () => getTaxSurveyByUserId(userId),
    { placeholderData: emptyTaxSurveyData, cacheTime: 0 },
  ),
  UpsertTaxSurveyDataForUser: (queryProps?: any) => useMutation(
    ({ userId, data }: any) => upsertTaxSurveyDataForUser(userId, data),
    queryProps,
  ),
};

export default taxSurvey;
