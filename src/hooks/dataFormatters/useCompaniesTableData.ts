import {useCompanyName} from './useCompanyName';

const IncoporationDataReceived = 'IncoporationDataReceived';
const IncoporationDataReceivedText = 'Incoporation Data Received';

interface PageInfo {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  totalCount: number;
  prevPage: number | null;
  nextPage: number | null;
}

interface UsersWithCompanies {
  data: Array<any>;
  pageInfo: PageInfo;
}

const initialData: UsersWithCompanies = {
  data: [],
  pageInfo: {
    currentPage: 1,
    nextPage: null,
    pageCount: 1,
    pageSize: 10,
    prevPage: null,
    totalCount: 1,
  },
};

const useCompanyRow = (item: any) => {
  const {
    id, name, company, stage,
  } = item;
  const companyName = useCompanyName(company);

  return {
    id,
    companyName,
    primaryContact: `${name?.first ?? ''} ${name?.last ?? ''}`,
    status:
      stage === IncoporationDataReceived ? IncoporationDataReceivedText : stage,
  };
};

export const useCompaniesTableData = (data: any) => {
  if (!data || data.length === 0) return initialData;

  const { data: companies, pageInfo } = data;
  const formattedCompanies = companies.map(useCompanyRow);

  return { data: formattedCompanies, pageInfo };
};

