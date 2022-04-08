import {useCompanyName} from '../useCompanyName';

describe('useCompanyName test', () => {
  it('should return current name', () => {
    const companyName = {
      name: 'sample name',
      suggested: [],
    };

    expect(useCompanyName(companyName)).toStrictEqual({
      name: 'sample name',
      isPending: false,
    });
  });

  it('should return temporary name', () => {
    expect(useCompanyName({
      name: '',
      suggested: ['sample test name'],
    })).toStrictEqual({
      name: 'sample test name',
      isPending: true,
    });

    expect(useCompanyName({
      name: '',
      suggested: [{ name: 'sample test name' }],
    })).toStrictEqual({
      name: 'sample test name',
      isPending: true,
    });

    expect(useCompanyName({
      name: '',
      suggested: [],
    })).toStrictEqual({
      name: 'Company Name',
      isPending: true,
    });
  });
});
