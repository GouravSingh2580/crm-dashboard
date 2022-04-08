import { switchFn } from 'helpers/switchFn';

export const DOCUMENT_STATUS = {
  Default: '',
  Submitted: 'Waiting',
  Rejected: 'Rejected',
  Approved: 'Approved',
};

export const getStatus = switchFn(DOCUMENT_STATUS, 'Default');
