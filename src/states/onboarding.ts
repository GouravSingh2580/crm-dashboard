import { createState } from '@hookstate/core';
import UserData from '../models/UserData';

const OnboardingState = createState({
  //* step 1
  name: {
    first: '',
    middle: '',
    last: '',
    dob: '',
  },

  //* step 3
  contactDetails: {
    physicalAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    },
    mailingAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    },
    workPhone: '',
    physicalSameAsMailing: true,
  },

  isSoleProp: null,

  entityType: '',

  //* step 2
  companyDetails: {
    suggested: [] as any,
    industry: '',
    description: '',
  },

  //* step 2
  existingCompanyDetails: {
    name: '',
    incorporationDate: '',
    ein: '',
    ssn: '',
    state: '',
  },

  //* step4
  bankDetails: {
    bankName: '',
    useOtherBank: false,
    useExistingBank: false,
  },

  //* step 5
  directDeposit: {
    bankName: '',
    routingNumber: '',
    bankAccountNumber: '',
    bankAccountType: '',
  },
});

export const userDataToOnboardingState = (
  userData: UserData,
  isSolePropLocalStorage: boolean | null,
) => {
  const { userInfo, company } = userData;
  //* Set user info
  OnboardingState.name.set({
    first: userInfo.name?.first ?? '',
    middle: userInfo.name?.middle ?? '',
    last: userInfo.name?.last ?? '',
    dob: userInfo.dob ?? '',
  });

  //* Set user direct deposit details
  OnboardingState.directDeposit.set({
    bankName: userInfo.bankName ?? '',
    routingNumber: userInfo.routingNumber ?? '',
    bankAccountNumber: userInfo.bankAccountNumber ?? '',
    bankAccountType: userInfo.bankAccountType ?? '',
  });

  //* Set company details
  OnboardingState.isSoleProp.set(
    userData.isCompanySoleProp(isSolePropLocalStorage) as any,
  );

  OnboardingState.entityType.set(isSolePropLocalStorage as any);

  if (userData.isCompanySoleProp() === true) {
    OnboardingState.companyDetails.set({
      suggested: company?.suggested?.length ? company.suggested : [],
      industry: company?.industry ?? '',
      description: company?.description ?? '',
    });
  } else if (userData.isCompanySoleProp() === false) {
    OnboardingState.existingCompanyDetails.set({
      name: company?.name ?? '',
      incorporationDate: company?.incorporationDate ?? '',
      ein: company?.ein ?? '',
      ssn: '',
      state: company?.contactDetails?.physicalAddress?.state ?? '',
    });
  }

  //* Set company bank details
  OnboardingState.bankDetails.set({
    bankName: company?.bankName ?? '',
    useExistingBank: company?.bankName ? !!company?.useExistingBank : false,
    useOtherBank: company?.bankName ? !!company?.useOtherBank : false,
  });

  //* Set Company contact details
  OnboardingState.contactDetails.set({
    physicalAddress: {
      street1: company?.contactDetails?.physicalAddress?.street1 ?? '',
      street2: company?.contactDetails?.physicalAddress?.street2 ?? '',
      city: company?.contactDetails?.physicalAddress?.city ?? '',
      state: company?.contactDetails?.physicalAddress?.state ?? '',
      zip: company?.contactDetails?.physicalAddress?.zip ?? '',
    },
    mailingAddress: {
      street1: company?.contactDetails?.mailingAddress?.street1 ?? '',
      street2: company?.contactDetails?.mailingAddress?.street2 ?? '',
      city: company?.contactDetails?.mailingAddress?.city ?? '',
      state: company?.contactDetails?.mailingAddress?.state ?? '',
      zip: company?.contactDetails?.mailingAddress?.zip ?? '',
    },
    workPhone: company?.contactDetails?.workPhone ?? '',
    physicalSameAsMailing: company?.contactDetails?.physicalAddress?.street1
      ? !!(
        company?.contactDetails?.physicalAddress?.street1
        === company?.contactDetails?.mailingAddress?.street1
        && company?.contactDetails?.physicalAddress?.street2
        === company?.contactDetails?.mailingAddress?.street2
        && company?.contactDetails?.physicalAddress?.city
        === company?.contactDetails?.mailingAddress?.city
        && company?.contactDetails?.physicalAddress?.state
        === company?.contactDetails?.mailingAddress?.state
        && company?.contactDetails?.physicalAddress?.zip
        === company?.contactDetails?.mailingAddress?.zip
      )
      : true,
  });
};

export default OnboardingState;
