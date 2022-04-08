import { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, List } from '@mui/material';
import { CONFIG } from 'config';

import { STATES, BUSINESS_INDUSTRIES } from 'enums';
import { Company } from 'models/company';
import { Contact } from 'hooks/api/useContacts';
import { UserInfo } from 'services/users';
import { isEqual } from 'lodash';
import { IAccount } from 'models/account';
import { FLAGS, useFeatureFlag } from 'hooks/useFeatureFlag';
import { EditField } from './EditField';
import { SsnField } from './SsnField';
import { ViewField } from './ViewField';
import { EditableComponent } from './EditableComponent';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4, 15),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(4),
    },
  },
  title: {
    color: theme.palette.primary.main,
    margin: theme.spacing(4, 0),
    fontWeight: 'bold',
  },
}));

interface Props {
  documentSigningCompleted: boolean;
  companyData: Company;
  userData: UserInfo;
  contactData: Contact;
  accountData: IAccount;
}

interface EditFieldFn {
  value: any;
  label: string;
  name: string;
  isValid: boolean;
}

export const Profile = ({
  documentSigningCompleted,
  companyData,
  userData,
  contactData,
  accountData,
}: Props) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState<string | false>(false);
  const [editField, setEditFieldState] = useState<EditFieldFn | undefined>(
    undefined,
  );
  const [physicalSameAsMailing, setPhysicalSameAsMailing] =
    useState<boolean>(true);

  const {
    email,
    name: { first, middle, last },
    dob,
    bankName,
    routingNumber,
    bankAccountNumber,
    bankAccountType,
  } = userData;

  const {
    industry,
    description,
    suggested,
    name,
    ein,
    incorporationDate,
    entityType,
    contactDetails: {
      workPhone = '',
      physicalAddress: {
        street1: physicalStreet1 = '',
        street2: physicalStreet2 = '',
        city: physicalCity = '',
        state: physicalState = '',
        zip: physicalZip = '',
      } = {},
      mailingAddress: {
        street1: mailingStreet1 = '',
        street2: mailingStreet2 = '',
        city: mailingCity = '',
        state: mailingState = '',
        zip: mailingZip = '',
      } = {},
    } = {},
  } = companyData;

  useEffect(() => {
    const isPhysicalSameAsMailing = isEqual(
      companyData?.contactDetails?.physicalAddress,
      companyData?.contactDetails?.mailingAddress,
    );
    setPhysicalSameAsMailing(isPhysicalSameAsMailing);
  }, [companyData.contactDetails]);

  const setEditField = ({
    value,
    label,
    name: fieldName,
    isValid,
  }: EditFieldFn) => {
    let newValue = value;
    let newName = fieldName;

    switch (fieldName) {
      case 'industry': {
        const bIndustry = BUSINESS_INDUSTRIES.find(
          (item) => item.title === value,
        );
        newValue = bIndustry ? bIndustry.title : value;
        break;
      }
      case 'suggested':
        newName = 'name';
        break;
      case 'physicalState':
      case 'mailingState': {
        const state = STATES.find((item) => item.code === value);
        newValue = state ?? '';
        break;
      }
      default:
        break;
    }

    setEditFieldState({ value: newValue, label, name: newName, isValid });
  };

  const onPhysicalSameAsMailingChange = (val: boolean) => {
    setPhysicalSameAsMailing(val);
  };

  const onClose = () => {
    setEditMode(false);
    setEditFieldState(undefined);
  };

  const Field = (
    label: string,
    value: any,
    fieldName: string,
    isEditable = true,
    href = '',
  ) => {
    const params = {
      value,
      isEditable,
      label,
      href,
      name: fieldName,
    };

    return label === editMode && editField != null ? (
      <EditField
        key={fieldName}
        name={fieldName}
        label={label}
        companyData={companyData}
        userData={userData}
        contactData={contactData}
        onEditFieldChange={setEditField}
        physicalSameAsMailing={physicalSameAsMailing}
        onPhysicalSameAsMailingChange={onPhysicalSameAsMailingChange}
        editField={editField}
        onClose={onClose}
        data-testid={`edit-field-${fieldName}`}
        EditableComponent={EditableComponent}
      />
    ) : (
      <ViewField
        {...params}
        key={fieldName}
        editMode={editMode}
        setEditMode={setEditMode}
        setEditField={setEditField}
      />
    );
  };

  const displayCompanyData = () => {
    const result = [
      Field('Entity Type', entityType, 'entityType', !documentSigningCompleted),
      Field('Login Email Address', email, 'email', false),
      Field('Phone Number', workPhone, 'workPhone'),
      Field('Industry of Business', industry, 'industry'),
      Field('Business description', description, 'description'),
      Field('Company Name Options', { suggested, name }, 'suggested'),
      Field('Date of Incorporation', incorporationDate, 'incorporationDate'),
      Field('State of Incorporation', physicalState, 'physicalState'),
      Field('EIN', ein, 'ein'),
    ];

    return <List data-testid="company-detail-list">{result}</List>;
  };

  const displayContactData = () => {
    const result = [
      Field('Mailing Address 1', mailingStreet1, 'mailingStreet1'),
      Field('Mailing Address 2', mailingStreet2, 'mailingStreet2'),
      Field('Mailing City', mailingCity, 'mailingCity'),
      Field('Mailing State', mailingState, 'mailingState'),
      Field('Mailing Zip', mailingZip, 'mailingZip'),

      Field(
        'Physical address is the same',
        physicalSameAsMailing,
        'physicalSameAsMailing',
      ),
    ];

    if (!physicalSameAsMailing) {
      result.push(
        Field('Physical Address 1', physicalStreet1, 'physicalStreet1'),
        Field('Physical Address 2', physicalStreet2, 'physicalStreet2'),
        Field('Physical City', physicalCity, 'physicalCity'),
        Field('Physical State', physicalState, 'physicalState'),
        Field('Physical Zip', physicalZip, 'physicalZip'),
      );
    }

    return <List data-testid="company-contact-list">{result}</List>;
  };

  const displayMemberData = () => {
    const result = [
      Field('First Name', first, 'first'),
      Field('Middle Name', middle, 'middle'),
      Field('Last Name', last, 'last'),
      Field('Date of Birth', dob, 'dob'),
    ];

    return (
      <List data-testid="member-list">
        {result}
        <SsnField />
      </List>
    );
  };

  const displayDepositData = () => {
    const result = [
      Field('Bank Name', bankName, 'bankName'),
      Field('Routing Number', routingNumber, 'routingNumber'),
      Field('Account Number', bankAccountNumber, 'bankAccountNumber'),
      Field('Account Type', bankAccountType, 'bankAccountType'),
    ];

    return <List data-testid="deposit-list">{result}</List>;
  };

  const betaEnabled = useFeatureFlag(FLAGS.BETA);
  const displayHubspotData = () => {
    const fieldHubspot = Field(
      'Hubspot Contact ID',
      contactData.hubspotId,
      'hubspotId',
      true,
      `https://app.hubspot.com/contacts/${CONFIG.hubspotAccountId}/contact/${contactData.hubspotId}`,
    );
    const fieldSuccessManager = Field(
      'Success Manager',
      accountData?.csm?.name,
      'csmName',
      false,
    );
    let result = [fieldHubspot, fieldSuccessManager];
    if (betaEnabled) {
      const fieldGustoCompany = Field(
        'Gusto Company',
        accountData.gusto
          ? {
              uuid: accountData.gusto.companyUUID,
              name: accountData.gusto.companyName,
            }
          : undefined,
        'gustoCompanyUUID',
        true,
      );
      result = [fieldHubspot, fieldGustoCompany, fieldSuccessManager];
    }

    return <List data-testid="hubspot-data">{result}</List>;
  };

  return (
    <>
      {displayHubspotData()}
      <Typography className={classes.title} variant="h5" component="h5">
        Company Details
      </Typography>

      {displayCompanyData()}

      <Typography className={classes.title} variant="h5" component="h5">
        Contact Details
      </Typography>

      {displayContactData()}

      <Typography className={classes.title} variant="h5" component="h5">
        Member Details
      </Typography>

      {displayMemberData()}

      <Typography className={classes.title} variant="h5" component="h5">
        Direct Deposit Info
      </Typography>

      {displayDepositData()}
    </>
  );
};
