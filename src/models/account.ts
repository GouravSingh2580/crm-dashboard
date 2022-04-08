import { ENTITY_MAPPING } from 'constants/common';

export enum ProgressTrackerStatus {
  Unknown = 'Unknown',
  Started = 'Started',
  NotStarted = 'notStarted',
  InProgress = 'inProgress',
  Completed = 'completed',
  Rejected = 'rejected',
}

export enum ProgressTrackerStages {
  Unsupported = 'unsupported',
  PersonalDetails = 'personalDetails',
  CompanyDetails = 'companyDetails',
  AddressDetails = 'addressDetails',
  FilingDocuments = 'filingDocuments',
  UploadIdentityProof = 'uploadIdentityProof',
  UploadLastYearTaxStatement = 'uploadLastYearTaxStatement',
  DocumentOfIncorporation = 'documentOfIncorporation',
  DirectDepositInformation = 'directDepositInformation',
  BankSelection = 'bankSelection',
  DocumentSigning = 'documentSigning',
}

export enum ProgressTrackerGroups {
  Unsupported = 'unsupported',
  Incorporation = 'incorporation',
  AccountVerification = 'accountVerification',
  FormCompletion = 'formCompletion',
}

export type AccountStatus = 'NEW' | 'ARCHIVED' | 'ACTIVE';

export type Status = {
  status: ProgressTrackerStatus;
  updatedAt: Date;
  updatedBy: string;
  comment: string;
};

export type ProgressTrackerGroup = {
  stage: string;
  group: string;
  status: Status[];
};

export type ProgressTrackerGroupRequest = {
  stage: string;
  group: string;
  status?: ProgressTrackerStatus;
  comment?: string;
};

export type CustomerDiscussionStatus = 'yes' | 'decline' | 'todo';

export type Insights = {
  ytdExpense: number;
  ytdGrossProfit: number;
  ytdNetProfit: number;
}

interface GustoFields {
  companyUUID: string;
  companyName: string;
  credentialsUserId?: string;
}

interface CustomerSuccessManager {
  name: string;
  email: string;
  meetLink: string;
}

type EntityKey = keyof typeof ENTITY_MAPPING;
export type EntityType = typeof ENTITY_MAPPING[EntityKey];

export type Taxes = {
  annualEstimated: number;
  ytdTotalPaid?: number;
  updatedAt?: string;
}

// base type for Account data
export interface IAccountBase {
  id?: string;
  rightSignatureURL?: string;
  estimatedSalary?: number;
  status: {
    label: AccountStatus;
    updatedAt?: string;
    updatedBy?: string;
  };
  taxes: Taxes;
  createdAt: string;
  ownerName?: string;
  entityType: EntityType;
  companyId?: string;
  health?: number;
  bookStatus?: number;
  payrollEnabled?: boolean;
  payrollRunNumber?: number;
  ytdSalary?: number;
  healthInsurance?: CustomerDiscussionStatus;
  retirementPlan?: CustomerDiscussionStatus;
  csm?: CustomerSuccessManager;
  gusto?: GustoFields;
  companyName?: string;
  insights?: Insights;
}

export interface IAccount extends IAccountBase {
  progress: ProgressTrackerGroup[];
  payrollEnabled: boolean;
  payrollRunNumber: number;
  companyName: string;
  healthInsurance: CustomerDiscussionStatus;
  retirementPlan: CustomerDiscussionStatus;
  estimatedSalary: number;
}

export interface IAccountXeroInfo {
  // eslint-disable-next-line camelcase
  client_id: string;
}

export interface IAccountRequest extends IAccountBase {
  progress: ProgressTrackerGroupRequest[];
  estimatedSalary: number;
}

export interface IInsights {
  ytdExpense: number;
}

export interface IAccountStatus {
  label: AccountStatus;
  updatedAt: string;
  updatedBy: string;
}

export interface IAccountListItem {
  companyId: string;
  companyName: string;
  entityType: string;
  id: string;
  ownerEmail: string;
  ownerId: string;
  ownerName: string;
  insights: IInsights;
  progress: ProgressTrackerGroup[];
  status: IAccountStatus;
  createdAt: string;
  rightSignatureURL?: string;
}

export type ProgressTrackerEvent = {
  stage: ProgressTrackerStages | 'EntitySelection' | 'IncorporationStatus';
  incorporationExists?: string;
  stageStatus?: ProgressTrackerStatus;
  accountId?: string;
  entityType: string;
  status?: 'success' | 'error';
  bankName?: string;
  bankRequired?: string;
};
