import { Company } from 'models/company';

export const useCompanyName = (company: Company) => {
  if (company?.name) {
    return { name: company?.name, isPending: false };
  }

  let tmpName = 'Company Name';

  const item = company?.suggested && company?.suggested[0] && company?.suggested[0];

  if (item && typeof item === 'string') {
    tmpName = item;
  } else if (item && item.name && typeof item.name === 'string') {
    tmpName = item.name;
  }

  return { name: tmpName, isPending: true };
};

