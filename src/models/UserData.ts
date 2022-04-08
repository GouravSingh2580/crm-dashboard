import { UserInfo } from 'services/users';
import { Company } from 'models/company';
import { HubspotUserData } from 'services/hubspot';
import {
  getDocumentAvailableForCategory,
  isDocumentAvailableForCategory,
} from 'helpers/documents';
import { ENTITY_MAPPING } from 'constants/common';
import { Category, logInfo } from 'helpers/sentry';
import { FormationsDocument } from 'hooks/dataFormatters/useDocumentsTableData';

class UserData {
  userInfo: UserInfo;

  company: Company | null;

  hubspotData: HubspotUserData | null;

  documents: any;

  kycDocuments: any;

  constructor(
    userInfo: UserInfo,
    company: Company | null,
    hubspotData: HubspotUserData | null,
    files?: any,
    kycDocuments: FormationsDocument[] = [],
  ) {
    this.userInfo = userInfo;
    this.company = company;
    this.hubspotData = hubspotData;
    this.documents = files;
    this.kycDocuments = kycDocuments;
  }

  //* Onboarding - Step 1
  isUserDataFilled(): boolean {
    return !!(this.userInfo.name?.first && this.userInfo.name?.last);
  }

  //* Onboarding - Step 2
  isCompanyDataFilled(): boolean {
    const checkSoleProp = {
      suggestedLength: this.company?.suggested?.length,
      industry: this.company?.industry,
      description: this.company?.description,
    };
    const checkNonSoleProp = {
      companyName: this.company?.name,
      companyIncorporationDate: this.company?.incorporationDate,
      companyEin: this.company?.ein,
    };
    logInfo({
      category: Category.OnBoarding,
      message: `[isCompanyDataFilled] User is Sole Prop: ${this.isCompanySoleProp()}, ${this.isCompanySoleProp()
        ? JSON.stringify(checkSoleProp)
        : JSON.stringify(checkNonSoleProp)}`,
    });

    return !!(this.isCompanySoleProp()
      ? this.company?.suggested?.length
      && this.company?.industry
      && this.company?.description
      : this.company?.name
      && this.company?.incorporationDate
      && this.company?.ein);
  }

  //* Onboarding - Step 3
  isCompanyAddressDataFilled(): boolean {
    return !!(
      this.company?.contactDetails?.workPhone
      && this.company?.contactDetails?.physicalAddress.street1
      && this.company?.contactDetails?.physicalAddress.state
      && this.company?.contactDetails?.physicalAddress.city
      && this.company?.contactDetails?.physicalAddress.zip
    );
  }

  //* Onboarding - Step 4
  isCompanyBankDetailsFilled(): boolean {
    return !!this.company?.bankName;
  }

  //* Onboarding - Step 5
  isUserDirectDepositInfoFilled(): boolean {
    return !!this.userInfo.bankName;
  }

  //* Onboarding - Step 0
  isCompanySoleProp(
    isSolePropLocalStorage: boolean | null = null,
  ): boolean {
    const isCompanyDetailsNotFilled = !this.company?.suggested?.length && !this.company?.name;
    const entityType = this.company?.legacyEntityType;

    if (entityType != null) {
      logInfo({
        category: Category.OnBoarding,
        message: `User is Sole Prop: ${entityType === ENTITY_MAPPING.sole_prop}`,
      });
      return entityType === ENTITY_MAPPING.sole_prop;
    }
    if (isCompanyDetailsNotFilled && isSolePropLocalStorage !== null) {
      logInfo({
        category: Category.OnBoarding,
        message: `determine if user is sole prop using local storage: ${isSolePropLocalStorage}`,
      });
      return isSolePropLocalStorage;
    }
    if (isCompanyDetailsNotFilled) {
      return false;
    }
    // eslint-disable-next-line max-len
    return !!(this.company?.suggested?.length && !this.company?.name);
  }

  isKYCDocumentFilled(): boolean {
    return isDocumentAvailableForCategory({
      documents: this.kycDocuments,
      name: 'Miscellaneous',
      subcategory: 'Biographical Information',
      department: 'Permanent',
    });
  }

  //* Onboarding
  isDataFilled(): boolean {
    return (
      this.isUserDataFilled()
      && this.isCompanyDataFilled()
      && this.isCompanyAddressDataFilled()
      && this.isCompanyBankDetailsFilled()
      && this.isUserDirectDepositInfoFilled()
      && this.isKYCDocumentFilled()
    );
  }

  isEntityFilled(): boolean {
    return Boolean(this.company?.entityType && this.company?.legacyEntityType);
  }

  getLastStep(): number {
    if (!this.isEntityFilled()) {
      return 0;
    }
    if (!this.isUserDataFilled()) {
      return 1;
    }
    if (!this.isCompanyDataFilled()) {
      return 2;
    }
    if (!this.isCompanyAddressDataFilled()) {
      return 3;
    }
    if (!this.isCompanyBankDetailsFilled()) {
      return 4;
    }
    if (!this.isUserDirectDepositInfoFilled()) {
      return 5;
    }
    if (!this.isKYCDocumentFilled()) {
      return 6;
    }
    return 0;
  }

  hasUserSubscribed(): boolean {
    return this.hubspotData?.lifecycleStage === 'customer';
  }

  getKYCDocuments(): any[] {
    return getDocumentAvailableForCategory({
      documents: this.kycDocuments,
      name: 'Miscellaneous',
      subcategory: 'Biographical Information',
      department: 'Permanent',
    });
  }

  getCompanyId(): string | undefined {
    return this.company?.id;
  }

  getuserId(): string | undefined {
    return this.userInfo?.id;
  }
}

export default UserData;
