import {useCompanyDataForAdminPage} from '../useCompanyDataForAdminPage';

describe('useCompanyDataForAdminPage test', () => {
  const defaultData = {
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
  const sampleData = {
    id: '1',
    name: 'sample name',
    suggested: [],
    bankName: 'chase',
    useExistingBank: null,
    entityType: 'sample type',
    ein: 'sample ein',
    state: 'CA',
    contactDetails: {
      workPhone: '123-456-7890',
      mailingAddress: {
        street1: 'sample street',
        street2: '',
        city: 'sample city',
        state: 'WA',
        zip: '12345',
        country: 'USA',
      },
    },
  };

  it('should return default data', () => {
    expect(useCompanyDataForAdminPage(null)).toStrictEqual(defaultData);
    expect(useCompanyDataForAdminPage(undefined)).toStrictEqual(defaultData);
  });

  it('should return data', () => {
    expect(useCompanyDataForAdminPage(sampleData)).toStrictEqual({
      id: '1',
      name: 'sample name',
      suggested: [],
      bankName: 'chase',
      useExistingBank: null,
      entityType: 'sample type',
      ein: 'sample ein',
      state: 'CA',
      contactDetails: {
        workPhone: '123-456-7890',
        mailingAddress: {
          street1: 'sample street',
          street2: '',
          city: 'sample city',
          state: 'WA',
          zip: '12345',
          country: 'USA',
        },
      },
    });
  });

  it.skip('should return physicalSameAsMailing', () => {
    const data:any = { ...sampleData };
    data.contactDetails.physicalAddress = { ...data.contactDetails.mailingAddress };
    expect(useCompanyDataForAdminPage([data])).toHaveProperty('contactDetails.physicalSameAsMailing', true);
    data.contactDetails.physicalAddress.street1 = 'another sample test';
    expect(useCompanyDataForAdminPage([data])).toHaveProperty('contactDetails.physicalSameAsMailing', false);
  });
});
