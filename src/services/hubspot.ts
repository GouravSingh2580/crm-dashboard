import { getErrorMessage } from 'helpers/error';
import { CONFIG } from 'config';
import getUnixTimestamp from '../helpers/unixTimeStamp';
import Api from './axios';

const baseURL = CONFIG.apiBaseUrl;

const formatHubspotPost = (option: string, data: string) => {
  if (option === 'annual-income') {
    switch (data) {
      case '40000':
        return 'Less than $40K';
      case '76600':
        return '$40K-$80K';
      case '113200':
        return '$80K-$150K';
      case '150000':
        return 'Over $150K';
      default:
        return '';
    }
  } else if (option === 'business-expenses') {
    switch (data) {
      case '10000':
        return 'Less than $10K';
      case '19000':
        return '$10K-$20K';
      case '28000':
        return '$20K-$30K';
      case '37000':
        return '$30K-$40K';
      case '46000':
        return '$40K-$50K';
      case '55000':
        return '$50K-$60K';
      case '64000':
        return '$60K-$70K';
      case '73000':
        return '$70K-$80K';
      case '82000':
        return '$80K-$90K';
      case '91000':
        return '$90K-$100K';
      case '100000':
        return 'Over $100K';
      default:
        return '';
    }
  } else if (option === 'annually-benefits') {
    switch (data) {
      case '5000':
        return 'Less than $5,000 per year';
      case '15000':
        return '$5,000 to $15,000 per year';
      case '20000':
        return '$15,000 to $30,000 per year';
      case '30000':
        return 'Over $30,000 per year';
      case '40000':
        return 'I am not sure';
      default:
        return '';
    }
  } else if (option === 'health-coverage') {
    switch (data) {
      case '2000':
        return 'Less than $2,000';
      case '4000':
        return '$2,000-$3,500';
      case '6000':
        return '$3,500-$5,000';
      case '8000':
        return '$5,000-$8,000';
      case '10000':
        return '$8,000-$12,000';
      case '12000':
        return 'Over $12,000';
      default:
        return '';
    }
  } else if (option === 'spend-time') {
    switch (data) {
      case '10':
        return 'Less than 10 hours per month (about 2 hours per week)';
      case '20':
        return '10 hours - 20 hours per month (about half a day per week)';
      case '30':
        return '20 hours - 40 hours per month (about a full day every week)';
      case '40':
        return 'Over 40 hours per month (more than a day per week)';
      default:
        return '';
    }
  } else if (option === 'management-costs') {
    switch (data) {
      case '0':
        return '$0 - I do it all by myself';
      case '1250':
        return 'Less than $500 per year';
      case '2500':
        return '$500-$1,500 per year';
      case '3750':
        return '$1,500-$3,500 per year';
      case '5000':
        return '$3,500-$5,000 per year';
      case '6250':
        return '$5,000-$7,500 per year';
      case '7500':
        return 'Over $7500 per year';
      default:
        return '';
    }
  } else if (option === 'taxes') {
    return data;
  } else if (option === 'legalEntity') {
    switch (data) {
      case 'sole_prop':
        return 'Sole proprietorship';
      case 'llc':
        return 'LLC';
      case 's_corp':
        return 'S-Corp';
      case 'c_corp':
        return 'C-Corp';
      default:
        return '';
    }
  }
  return '';
};

const formatBenefits = (benefits: any) => {
  const formatedValues = (type: string) =>
    ({
      retirement_savings: 'Retirement savings (IRA, SEP IRA, 401K, etc.)',
      flexible_savings_account: 'Flexible Savings Account',
      health_savings_account: 'Health Savings Account',
      i_have_no_benefits: 'I have no benefits',
    }[type]);

  const mappedValues = benefits.map((benefit: string) =>
    formatedValues(benefit),
  );

  if (benefits.length !== 0) {
    return mappedValues.join(';');
  }
  return 'I have no benefits';
};

const formatHealthCoverage = (healthCoverage: any) => {
  if (healthCoverage.includes('im_using_my_partners_health_insurance')) {
    return "I'm on someone else's insurance (partner, parents)";
  }
  if (healthCoverage.includes('idont_have_health_insurance')) {
    return "I don't have health insurance";
  }
  return healthCoverage.join(';');
};

const dataMapper = (params: any) => {
  if (!params || Object.keys(params).length <= 0) {
    return {};
  }
  return {
    calculator_what_type_of_benefits_do_you_have_today_: formatBenefits(
      params.benefits,
    ),
    calculator_what_are_your_projected_annual_business_expenses_:
      formatHubspotPost('business-expenses', params.expense),
    calculator_what_type_of_health_coverage_do_you_have_: formatHealthCoverage(
      params.healthCoverage,
    ),
    calculator_what_is_your_business_legal_entity_: formatHubspotPost(
      'legalEntity',
      params.legalEntity,
    ),
    calculator_how_much_money_will_your_business_generate_this_year_:
      formatHubspotPost('annual-income', params.revenue),
    calculator_how_much_did_you_pay_in_taxes_last_year_: formatHubspotPost(
      'taxes',
      `${params.taxes}`,
    ),
    calculator_how_much_time_do_you_spend_managing_your_business_financials_and_back_office_:
      formatHubspotPost('spend-time', params.timeSpend),
    // eslint-disable-next-line max-len
    calculator_what_is_your_annual_total_cost_for_managing_your_business_financials_including_bookkeepi:
      formatHubspotPost('management-costs', params.totalAnnualCost),
    calculator_how_much_are_you_paying_annually_for_your_health_coverage_:
      formatHubspotPost('health-coverage', params.insurance),
  };
};

export enum TimestampAccountType {
  REGISTRATION = 'account_registration',
  BANKPREFERENCE = 'bank_preference_form',
  LLCFORM = 'llc_form_information',
  PRICING_VIEWED = 'pricing_viewed',
}

const getHubSpotInternalId = async (contactId: string) => {
  try {
    const { data } = await Api.get<{ id: string }>(
      `/contacts/${contactId}`,
      {
        baseURL,
      },
    );

    return data.id;
  } catch (getHubspotIdErr) {
    throw new Error(getErrorMessage(getHubspotIdErr));
  }
};

const updateContact = async (contactId: string, data: Record<string, any>) =>
  Api.patch(`/contacts/${contactId}`, data, {
    baseURL,
  });

const updateContactProperties = async (
  params: any,
  contactId: string,
  isInternalId: Boolean,
) => {
  let id;
  if (!isInternalId) {
    id = await getHubSpotInternalId(contactId);
  } else {
    id = contactId;
  }

  if (!params || Object.keys(params).length <= 0) {
    return { contactId: id };
  }

  try {
    await updateContact(id, { custom: { ...dataMapper(params) } });
    return { contactId: id };
  } catch (updateContactPropErr) {
    throw new Error(getErrorMessage(updateContactPropErr));
  }
};

const upsertContactProperties = async (params: any) => {
  const { results, ...rest } = params;

  try {
    const { data } = await Api.post('/contacts', rest, {
      baseURL,
    });

    const { id } = data;
    return await updateContactProperties(results, id, true);
  } catch (apiError) {
    throw new Error(getErrorMessage(apiError));
  }
};

export const updateBasicContactProperties = async (
  params: any,
  contactId: string,
) => {
  try {
    return await updateContact(contactId, { custom: { ...params } });
  } catch (updateBasicContactError) {
    throw new Error(getErrorMessage(updateBasicContactError));
  }
};

export const updateTimeContactProperties = async (
  property: TimestampAccountType,
  contactId: string,
) => {
  try {
    return await updateContact(contactId, {
      custom: { [property]: getUnixTimestamp() },
    });
  } catch (updateTimeContactPropError) {
    throw new Error(getErrorMessage(updateTimeContactPropError));
  }
};
export interface HubspotUserData {
  id: string;
  hubspotId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  lifecycleStage?: 'opportunity' | 'customer';
}

async function getHubSpotUserProperties(
  contactId: string,
): Promise<HubspotUserData> {
  try {
    const { data } = await Api.get(`/contacts/${contactId}/properties`, {
      baseURL,
    });

    return data;
  } catch (getHubspotUserPropError: unknown) {
    if (typeof getHubspotUserPropError === 'string') {
      throw new Error(getHubspotUserPropError);
    } else if (getHubspotUserPropError instanceof Error) {
      throw getHubspotUserPropError;
    } else {
      throw new Error('Cannot get contact properties');
    }
  }
}

export const HubspotService = {
  upsertContactProperties,
  updateContact,
  updateContactProperties,
  updateTimeContactProperties,
  updateBasicContactProperties,
  TimestampAccountType,
  getHubSpotInternalId,
  getHubSpotUserProperties,
};
