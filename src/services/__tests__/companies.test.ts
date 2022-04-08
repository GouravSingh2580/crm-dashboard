import { transformCompany, transformCompanyDataForUpdate } from 'services/companies';
import { omit } from 'lodash';
import { BankNameKey, Company } from 'models/company';

describe('company services test', () => {
  describe('transformCompany test', () => {
    const companyResponse = {
      id: '61d617457a5ce96810ff2e21',
      entityType: 'LLC',
      legacyEntityType: 'LLC',
      updatedAt: '2022-01-05T22:19:22.286Z',
      updatedBy: '61d617427a5ce96810ff2e20',
      hasBankAccount: false,
      bankName: 'Bank Of America',
    };
    it('Bank of America mapping', () => {
      const company = transformCompany(companyResponse);
      expect(company).toHaveProperty('bankName', 'bankOfAmerica');
    });
    it('Chase mapping', () => {
      companyResponse.bankName = 'Chase';
      const company = transformCompany(companyResponse);
      expect(company).toHaveProperty('bankName', 'chase');
    });
    it('null case', () => {
      const company = transformCompany(omit(companyResponse, 'bankName'));
      expect(company).not.toHaveProperty('bankName');
    });
  });

  describe('transformCompanyDataForUpdate test', () => {
    const companyData: Company = {
      id: '61d617457a5ce96810ff2e21',
      entityType: 'LLC',
      legacyEntityType: 'LLC',
      hasBankAccount: false,
      bankName: 'bankOfAmerica' as BankNameKey,
      ein: '123456789',
      incorporationDate: undefined,
    };
    it('Bank of America mapping', () => {
      const companyRequest = transformCompanyDataForUpdate(companyData);
      expect(companyRequest).toHaveProperty('bankName', 'Bank Of America');
    });
    it('Chase mapping', () => {
      companyData.bankName = 'chase'
      const companyRequest = transformCompanyDataForUpdate(companyData);
      expect(companyRequest).toHaveProperty('bankName', 'Chase');
    });
    it('ein should not be empty', () => {
      const companyRequest = transformCompanyDataForUpdate(companyData);
      expect(companyRequest).toHaveProperty('ein', '123456789');
    });
    it('ein should be empty', () => {
      companyData.ein = ''
      const companyRequest = transformCompanyDataForUpdate(companyData);
      expect(companyRequest).not.toHaveProperty('ein');
    });
    it('incorporationDate', () => {
      companyData.incorporationDate = new Date('2021-12-30T00:00:00').toDateString();
      const companyRequest = transformCompanyDataForUpdate(companyData);
      expect(companyRequest).toHaveProperty('incorporationDate', '12/30/2021');
    });
  })
});
