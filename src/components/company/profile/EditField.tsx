import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Close as CloseIcon, Check as CheckIcon } from '@mui/icons-material';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MuiAlert from '@mui/material/Alert';
import {
  ProgressTrackerGroups,
  ProgressTrackerStages,
  ProgressTrackerStatus,
} from 'services/account';
import { useUpdateUser } from 'hooks/api';
import { useCreateCompany, useUpdateCompany } from 'hooks/api/useCompanies';
import { useUpdateAccount } from 'hooks/api/useAccounts';
import useContacts, { Contact } from 'hooks/api/useContacts';
import queryClient from 'states/reactQueryClient';
import { Address, Company } from 'models/company';
import { UserInfo } from 'services/users';
import { ENTITY_MAPPING } from 'constants/common';
import { formatNumberWithDashes } from 'helpers/text-transformer';
import { useConnectGustoCompany, useDisconnectGustoCompany } from 'hooks/api/gusto';

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
  listItem: {
    display: 'flex',
    paddingRight: theme.spacing(15),
    minHeight: theme.spacing(10),
  },
  listItemLabel: {
    fontWeight: 'bold',
    margin: theme.spacing(1, 0),
  },
  listItemValue: {
    margin: theme.spacing(1, 0),
  },
}));

const shouldUpdateAccountProgress = (
  entityType: string,
  newEntityType: string,
): boolean => {
  if (
    entityType === ENTITY_MAPPING.sole_prop &&
    newEntityType !== ENTITY_MAPPING.sole_prop
  ) {
    return true;
  }
  if (
    entityType !== ENTITY_MAPPING.sole_prop &&
    newEntityType === ENTITY_MAPPING.sole_prop
  ) {
    return true;
  }
  return false;
};
interface EditFieldChangeVariables {
  value: any;
  label: string;
  name: string;
  isValid: boolean;
}

interface Props {
  editField: { value: string; label: string; name: string; isValid: boolean };
  name?: string;
  label?: string;
  onClose: () => void;
  companyData: Company;
  userData: UserInfo;
  contactData: Contact;
  EditableComponent: FC<any>;
  onEditFieldChange: (params: EditFieldChangeVariables) => void;
  physicalSameAsMailing: boolean;
  onPhysicalSameAsMailingChange: (val: boolean) => void;
}

export const EditField = ({
  editField,
  onClose,
  onEditFieldChange,
  physicalSameAsMailing,
  onPhysicalSameAsMailingChange,
  companyData,
  userData,
  contactData,
  EditableComponent,
}: Props) => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { updateUserAsync: updateUser } = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['user', id]);
    },
  });
  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['company/user', 'userid', id]);
    },
  });
  const { mutateAsync: createCompany } = useCreateCompany({
    onSuccess: () => {
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['company/user', 'userid', id]);
    },
  });
  const { mutateAsync: updateContact } = useContacts.UpdateContact({
    onSuccess: () => {
      queryClient.invalidateQueries(['contactData']);
      queryClient.invalidateQueries(['contact', contactData.id]);
    },
  });
  const { mutateAsync: upsertContact } = useContacts.UpsertContact({
    onSuccess: () => {
      queryClient.invalidateQueries(['contactData']);
      queryClient.invalidateQueries(['userData']);
      queryClient.invalidateQueries(['user', id]);
    },
  });

  const { mutateAsync: updateAccountProgress } = useUpdateAccount(
    userData.accountId,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['account', userData.accountId]);
        await queryClient.invalidateQueries(['company/user', 'userid', id]);
      },
    },
  );

  const { connectGustoCompanyAsync } = useConnectGustoCompany(
    userData.accountId!,
  );
  const { disconnectGustoCompanyAsync } = useDisconnectGustoCompany(userData.accountId!)

  const { id: companyId } = companyData;
  const { id: userId } = userData;

  const updateMemberData = async (v: string, n: string) => {
    const {
      name: { first, middle, last },
      dob,
    } = userData;

    const newData = {
      name: {
        first,
        middle,
        last,
        [n]: v,
      },
      ...(dob && { dob }),
      [n]: v,
    };

    try {
      await updateUser({ id, data: newData });
    } catch (e) {
      console.log(e);
      throw new Error('There was an error updating user data.');
    }
  };

  const updateData = async (data: Partial<Company>) => {
    if (companyId) {
      await updateCompany({ id: companyId, data });
    } else {
      await createCompany({ userId, data });
    }
  };

  const updateCompanyData = async (v: any, n: string) => {
    const {
      industry,
      description,
      suggested,
      incorporationDate,
      ein,
      entityType,
    } = companyData;
    const hasSuggestedName = suggested && suggested.length > 0;
    const newData = {
      industry,
      description,
      suggestedNames: hasSuggestedName ? suggested : undefined,
      incorporationDate,
      ein,
      [n]: v,
    };

    try {
      await updateData(newData);
      if (
        newData?.entityType &&
        entityType &&
        shouldUpdateAccountProgress(entityType, newData.entityType)
      ) {
        // If LLC/S-corp/C-corp to Sole-prop OR Sole-prop to LLC/S-corp/C-corp reject company detail progress
        await updateAccountProgress({
          progress: [
            {
              stage: ProgressTrackerStages.CompanyDetails,
              status: ProgressTrackerStatus.Rejected,
              group: ProgressTrackerGroups.Incorporation,
            },
          ],
        });
      }
    } catch (e) {
      console.log(e);
      throw new Error('There was an error sending the company data.');
    }
  };

  const updateHubspotContactData = async (v: string) => {
    let contactId = contactData.id;
    const newData = {
      hubspotId: v,
    };

    try {
      // If contactId doesn't exist, then the user has not synced with Hubspot for
      // whatever reason.
      if (!contactId) {
        contactId = await upsertContact({ user: userData });
      }

      await updateContact({ id: contactId, data: newData });
    } catch (e) {
      throw new Error('There was an error sending the new Hubspot Contact ID');
    }
  };

  const updateContactData = async (v: any, n: string) => {
    let newValue = v;
    let { workPhone } = companyData.contactDetails!;
    const { mailingAddress, physicalAddress: physicalAddressInit } =
      companyData.contactDetails!;

    const isMailing = n.includes('mailing');
    const isPhysical = n.includes('physical');

    const newName = n
      .replace('mailing', '')
      .replace('physical', '')
      .toLowerCase();

    if (newName === 'state') {
      newValue = v.code;
    }

    const physicalAddress = physicalSameAsMailing
      ? mailingAddress
      : physicalAddressInit;

    if (isMailing) {
      // @ts-ignore
      mailingAddress[newName] = newValue;
    } else if (isPhysical) {
      // @ts-ignore
      physicalAddress[newName] = newValue;
    } else {
      workPhone = newValue;
    }

    const newData = {
      contactDetails: {
        mailingAddress,
        physicalAddress,
        workPhone,
      },
    };

    try {
      await updateData(newData);
    } catch (e) {
      console.log(e);
      throw new Error('There was an error sending the contact data.');
    }
  };

  const updatePhysicalAddressData = async (v: any) => {
    const { mailingAddress, workPhone } = companyData.contactDetails!;
    const physicalAddress: typeof mailingAddress = { ...mailingAddress };

    if (!v) {
      Object.keys(physicalAddress).forEach((key) => {
        physicalAddress[key as keyof Address] = '';
      });
    }

    const newData = {
      contactDetails: {
        mailingAddress,
        physicalAddress,
        workPhone,
      },
    };
    try {
      await updateData(newData);
    } catch (e) {
      console.log(e);
      throw new Error('There was an error sending the contact data.');
    }
  };

  const updateContactDataBySameAsMailing = async (v: boolean) => {
    await updatePhysicalAddressData(v);
    onPhysicalSameAsMailingChange(v);
  };

  const onSaveField = async (field: {
    value: any;
    name: string;
    isValid: boolean;
  }) => {
    const { value: fieldValue, name: fieldName, isValid } = field;

    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);
      switch (fieldName) {
        case 'first':
        case 'middle':
        case 'last':
        case 'dob':
        case 'bankName':
        case 'routingNumber':
        case 'bankAccountNumber':
        case 'bankAccountType':
          await updateMemberData(fieldValue, fieldName);
          break;
        case 'industry':
        case 'description':
        case 'incorporationDate':
        case 'name':
        case 'entityType':
          await updateCompanyData(fieldValue, fieldName);
          break;
        case 'ein':
          await updateCompanyData(
            formatNumberWithDashes(fieldValue),
            fieldName,
          );
          break;
        case 'mailingStreet1':
        case 'mailingStreet2':
        case 'mailingState':
        case 'mailingCity':
        case 'mailingZip':
        case 'physicalStreet1':
        case 'physicalStreet2':
        case 'physicalState':
        case 'physicalCity':
        case 'physicalZip':
        case 'workPhone':
          await updateContactData(fieldValue, fieldName);
          break;
        case 'physicalSameAsMailing':
          await updateContactDataBySameAsMailing(fieldValue);
          break;
        case 'hubspotId':
          await updateHubspotContactData(fieldValue);
          break;
        case 'gustoCompanyUUID':
          if (fieldValue) {
            await connectGustoCompanyAsync(fieldValue);
          } else {
            await disconnectGustoCompanyAsync();
          }
          break;
        default:
          break;
      }
      onClose();
    } catch (e) {
      setError(e as Error);
      setIsLoading(false);
    }
  };

  const { name, label, value } = editField;

  const onCloseErrorSnackbar = () => setError(null);
  return (
    <>
      <ListItem className={classes.listItem} key={label} divider>
        <EditableComponent
          name={name}
          value={value}
          onChange={(v: any, isValid: boolean, customName: string) => {
            onEditFieldChange({
              value: v,
              label,
              name: customName ?? name,
              isValid,
            });
          }}
          onSave={onSaveField}
          onClose={onClose}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="check"
            onClick={() => onSaveField(editField)}
            data-testid="button-save"
            size="large"
          >
            {isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
          </IconButton>
          <IconButton
            edge="end"
            aria-label="close"
            onClick={onClose}
            data-testid="button-cancel"
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={onCloseErrorSnackbar}
        data-testid="toast-error"
      >
        <MuiAlert onClose={onCloseErrorSnackbar} severity="error">
          {error?.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
