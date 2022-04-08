import {
  ProgressTrackerEvent,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'models/account';
import { ENTITY_MAPPING } from 'constants/common';
import { isUndefined, omitBy } from 'lodash';
import { sendHeapEvent } from './heap';

type EventType = {
  'Account Id'?: string;
  'Account Entity'?: string;
  Status?: string;
  'Bank Name'?: string;
  'Bank Required'?: string;
  'incorporationExists'?: string
};

const eventMaps: { [key in Partial<ProgressTrackerStages>]: string } & {
  EntitySelection: string;
  IncorporationStatus: string;
} = {
  [ProgressTrackerStages.Unsupported]: 'unsupported',
  [ProgressTrackerStages.UploadIdentityProof]: 'KYCUpload',
  [ProgressTrackerStages.UploadLastYearTaxStatement]: 'LastTaxUpload',
  [ProgressTrackerStages.DocumentOfIncorporation]: 'CompanyDocsUpload',
  [ProgressTrackerStages.DirectDepositInformation]: 'DirectDepositInformation',
  [ProgressTrackerStages.PersonalDetails]: 'AddPersonalInfo',
  [ProgressTrackerStages.CompanyDetails]: 'AddCompanyDetail',
  [ProgressTrackerStages.AddressDetails]: 'AddBizAddr',
  [ProgressTrackerStages.FilingDocuments]: 'AddCompanyDetails',
  [ProgressTrackerStages.BankSelection]: 'SelectBank',
  [ProgressTrackerStages.DocumentSigning]: 'SignDocuments',
  EntitySelection: 'EntitySelection',
  IncorporationStatus: 'IncorporationStatus'
};
export const getEventName = (
  stage: ProgressTrackerStages | 'EntitySelection' | 'IncorporationStatus',
  status: ProgressTrackerStatus = ProgressTrackerStatus.NotStarted,
  entity: string = '',
): string => {
  if (stage !== ProgressTrackerStages.CompanyDetails) {
    return eventMaps[stage];
  }
  if (
    status === ProgressTrackerStatus.Started &&
    entity === ENTITY_MAPPING.sole_prop
  ) {
    return 'AddCompanyOptions';
  }
  return 'AddCompanyDetail';
};

export const sendProgressTrackerEvent = ({
  accountId,
  incorporationExists,
  entityType,
  status = 'success',
  bankName,
  bankRequired,
  stage,
  stageStatus,
}: ProgressTrackerEvent) => {
  const eventName = getEventName(stage, stageStatus, entityType);
  const eventProperties: EventType = {
    'Account Id': accountId,
    'Account Entity': entityType,
    'Status': status,
    'Bank Name': bankName,
    'Bank Required': bankRequired,
    'incorporationExists': incorporationExists
  };
  sendHeapEvent(eventName, omitBy(eventProperties, isUndefined));
};
