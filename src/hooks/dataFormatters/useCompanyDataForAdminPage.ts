import { Company } from 'services/companies';

const initData = {
  id: '',
  name: '',
  suggested: [],
  bankName: '',
  useExistingBank: null,
  entityType: '',
  ein: '',
  state: '',
  contactDetails: {
    workPhone: '',
    mailingAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
    physicalAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
  },
};

export const useCompanyDataForAdminPage = (companyData: Company | undefined) => {
  if (!companyData) {
    return initData;
  }

  const result = { ...initData, ...companyData };

  result.suggested = result.suggested.map((item: any) => item.name);

  return result;
};

