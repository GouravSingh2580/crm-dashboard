import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { ReadOnlyForm, ReadOnlyItemType } from 'components/common/ReadOnlyForm';
import {
  useUpdateUser,
  useUpdateUserIdentity,
  useUserIdentityById,
} from 'hooks/api';
import EditIcon from '@mui/icons-material/Edit';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import { UserInfo } from 'services/users';
import queryClient from 'states/reactQueryClient';
import { PersonalDetailsSchema } from 'schemas/personalDetailsSchema';
import { FormationsFormFields, IFormField } from 'components/common/FormationsForm';
import { ReadOnlySSN } from 'components/common/ReadOnlySSN';
import { AuthService } from 'services';
import { CONSTANTS } from 'constants/common';
import { formatSsn } from 'helpers/text-transformer';

interface IPersonalDetailsViewProps {
  userData: UserInfo;
  handleComplete: () => void;
}

export const PersonalDetailsView: React.FC<IPersonalDetailsViewProps> = ({
  userData,
  handleComplete,
}) => {
  const { id: userId, name, dob } = userData;
  const userRole = AuthService.userRole();
  const isAdmin =
    CONSTANTS.USER_ROLES.FULFILLMENT !== userRole &&
    CONSTANTS.USER_ROLES.CUSTOMER_SERVICE !== userRole;
  const { userIdentity } = useUserIdentityById(userId, {
    enabled: !!userId && isAdmin,
  });
  const ssn = userIdentity?.ssn?.first5
    ? `${userIdentity?.ssn?.first5}${userIdentity?.ssn?.last4}`
    : '';
  const [showEditModal, setShowEditModal] = React.useState(false);

  const { updateUserAsync: updateUser } = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
    },
  });
  const { updateUserIdentityAsync: updateSSN } = useUpdateUserIdentity({
    onSuccess: () => {
      queryClient.invalidateQueries(['user', 'identity', userId]);
    },
  });
  const onFormSubmit = async (formData: {
    dob: string;
    first: string;
    middle: string;
    last: string;
    ssn: string;
  }) => {
    const data = {
      name: {
        first: formData.first,
        middle: formData.middle,
        last: formData.last,
      },
      dob: formData.dob,
    };

    await updateUser({ id: userData.id, data });
    if (formData.ssn) {
      await updateSSN({
        id: userData.id,
        ssn: formatSsn(formData.ssn),
      });
    }
    handleComplete();
    setShowEditModal(false);
  };

  let readOnlyItems: ReadOnlyItemType[] = [
    {
      title: 'Full Legal Name',
      value: name?.first
        ? `${name?.first} ${name?.middle || ''} ${name?.last}`
        : 'N/A',
    },
    {
      title: 'Date of Birth',
      value: dob,
    },
  ];

  let fieldsMap: IFormField[] = [
    {
      type: FormationsFormFields.Text,
      name: 'first',
      placeholder: 'Mary',
      autoCapitalize: true,
      label: 'First Name',
      autoFocus: true,
      maxLength: 25,
    },
    {
      type: FormationsFormFields.Text,
      name: 'middle',
      placeholder: 'D.',
      autoCapitalize: true,
      label: 'Middle Name',
      maxLength: 25,
    },
    {
      type: FormationsFormFields.Text,
      name: 'last',
      placeholder: 'Wang',
      autoCapitalize: true,
      label: 'Last Name',
      maxLength: 25,
    },
    {
      type: FormationsFormFields.Date,
      name: 'dob',
      placeholder: 'MM/DD/YYYY',
      label: 'Date of Birth',
    },
  ];


  if(isAdmin){
    readOnlyItems = [
      ...readOnlyItems,
      {
      title: 'Social Security Number',
      value: <ReadOnlySSN value={ssn} />,
    }];
    fieldsMap = [
      ...fieldsMap,
      {
      type: FormationsFormFields.SecuredText,
      name: 'ssn',
      placeholder: '',
      label: 'Social Security Number',
      maxLength: 11,
    }];
  }

  return (
    <div>
      <Grid container direction="column">
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Personal Details
          </Typography>
          <Button
            aria-label="delete"
            sx={{ marginLeft: '24px' }}
            startIcon={<EditIcon />}
            onClick={() => setShowEditModal(true)}
            data-testid="personal-detail-edit-btn"
          >
            Edit
          </Button>
        </Grid>
        <ReadOnlyForm items={readOnlyItems} />
      </Grid>
      {showEditModal && (
        <FormationsFormDialog
          title="Edit Personal Details"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          fieldsMap={fieldsMap}
          defaultValues={{
            first: name?.first,
            middle: name?.middle,
            last: name?.last,
            dob: dob || null,
            ssn,
            mode: 'onChange',
            reValidateMode: 'onChange',
          }}
          validationSchema={PersonalDetailsSchema}
          formContext={{
            isSSNRequired: isAdmin,
          }}
        />
      )}
    </div>
  );
};
