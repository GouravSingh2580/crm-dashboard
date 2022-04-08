export type BankNameKey = 'chase' | 'bankOfAmerica' | 'relay' | 'wellFargo' | 'other' | '';

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  country?: string;
  zip: string;
}

export type IncorporationStatus = 'active' | 'inactive' | 'dissolved' | 'suspended'

export interface Company {
  id?: string;
  accountId?: string;
  contactDetails?: {
    mailingAddress: Address;
    physicalAddress: Address;
    workPhone?: string;
  };
  suggested?: Array<{ name: string }>;
  industry?: string;
  description?: string;
  bankName?: BankNameKey;
  hasBankAccount?: boolean;
  useExistingBank?: boolean;
  useOtherBank?: boolean;
  name?: string;
  incorporationDate?: string;
  ein?: string;
  state?: string;
  entityType?: string;
  legacyEntityType?: string;
  stateOfIncorporation?: string;
  rightSignatureURL?: string;
  bankAccountNames?: string,
  incorporationRenewalDate?: string,
  incorporationStatus?: IncorporationStatus,
  hasEinNo?: boolean,
}

export interface CompanyApi extends Omit<Company, 'bankName'> {
  bankName?: string;
}

export interface CompanyName {
  name?: string;
  suggested?: Array<{ name: string }>;
}
