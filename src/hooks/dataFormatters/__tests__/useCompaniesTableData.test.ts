import {useCompaniesTableData} from '../useCompaniesTableData';

describe('useCompaniesTableData test', () => {
  const initialData = {
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
  it('should return default value', () => {
    expect(useCompaniesTableData(null)).toStrictEqual(initialData);
    expect(useCompaniesTableData(undefined)).toStrictEqual(initialData);
    expect(useCompaniesTableData([])).toStrictEqual(initialData);
  });

  it('should return data', () => {
    const data = {
      data: [{
        id: 1,
        name: { first: 'first', last: 'last' },
        company: { name: 'sample company', suggested: [] },
        stage: 'Incoporation Data Received',
      }],
      pageInfo: {
        currentPage: 1,
        nextPage: null,
        pageCount: 1,
        pageSize: 10,
        prevPage: 2,
        totalCount: 1,
      },
    };

    expect(useCompaniesTableData(data)).toStrictEqual({
      data: [{
        companyName: {
          isPending: false,
          name: 'sample company',
        },
        id: 1,
        primaryContact: 'first last',
        status: 'Incoporation Data Received',
      }],
      pageInfo: {
        currentPage: 1,
        nextPage: null,
        pageCount: 1,
        pageSize: 10,
        prevPage: 2,
        totalCount: 1,
      },
    });
  });
});
