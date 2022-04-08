import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Typography } from '@mui/material';
import queryClient from 'states/reactQueryClient';
import { businessAddressSchema } from 'schemas/businessAddressSchema';
import { Company } from 'services/companies';
import { useUpdateCompany } from 'hooks/api/useCompanies';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import { BusinessAddressView } from 'views/BusinessAddressView';
import { FormationsFormFields } from 'components/common/FormationsForm';
import { STATES } from 'enums';

interface IBusinessAddressProps {
  handleComplete: () => void;
  userData: any;
  companyData: Company;
}

const defaultAddress = {
  street1: '',
  street2: '',
  city: '',
  state: '',
  zip: '',
};

export const BusinessAddress: React.FC<IBusinessAddressProps> = ({
  userData,
  companyData,
  handleComplete,
}) => {
  const { id: userId } = userData;
  const { contactDetails } = companyData;
  const {
    street1: mailingAddress1,
    street2: mailingAddress2,
    city: mailingCity,
    state: mailingState,
    zip: mailingZip,
  } = contactDetails?.mailingAddress || defaultAddress;

  const {
    street1: physicalAddress1,
    street2: physicalAddress2,
    city: physicalCity,
    state: physicalState,
    zip: physicalZip,
  } = contactDetails?.physicalAddress || defaultAddress;

  const [physicalSameAsMailing, setPhysicalSameAsMailing] = useState(true);

  const [showEditModal, setShowEditModal] = React.useState(false);

  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: async () => {
      await queryClient.invalidateQueries(['company/user', 'userid', userId]);
      setShowEditModal(false);
    },
  });

  const onFormSubmit = async (formData: { [key: string]: string }) => {
    const address = {
      contactDetails: {
        mailingAddress: {
          street1: formData.mailingAddress1,
          street2: formData.mailingAddress2,
          city: formData.mailingCity,
          state: formData.mailingState?.code,
          zip: formData.mailingZip,
        },
        physicalAddress: {
          street1: formData.physicalAddress1,
          street2: formData.physicalAddress2,
          city: formData.physicalCity,
          state: formData.physicalState?.code,
          zip: formData.physicalZip,
        },
        workPhone: formData.workPhone,
      },
    };
    if (formData.physicalSameAsMailing) {
      address.contactDetails.physicalAddress =
        address.contactDetails.mailingAddress;
    }
    await updateCompany({ id: companyData.id!, data: address });
    handleComplete();
  };

  let formFields = [
    {
      type: FormationsFormFields.Text,
      name: 'mailingAddress1',
      placeholder: '1234 Ave E',
      label: 'Address Line 1',
      autoFocus: true,
      maxLength: 250
    },
    {
      type: FormationsFormFields.Text,
      name: 'mailingAddress2',
      placeholder: '',
      label: 'Address Line 2',
      maxLength: 250
    },
    {
      type: FormationsFormFields.Text,
      name: 'mailingCity',
      placeholder: 'Seattle',
      label: 'City',
      maxLength: 50
    },
    {
      type: FormationsFormFields.AutoComplete,
      name: 'mailingState',
      placeholder: 'Washington',
      label: 'State',
      options: STATES,
    },
    {
      type: FormationsFormFields.ZipCode,
      name: 'mailingZip',
      placeholder: '12345',
      label: 'Zip Code',
    },
    {
      type: FormationsFormFields.Phone,
      name: 'workPhone',
      label: 'Phone Number',
      placeholder: '(999) 999-9999',
    },
    {
      type: FormationsFormFields.SameAsAbove,
      name: 'physicalSameAsMailing',
      placeholder: '',
      label:
        'My business physical address is the same as my business mailing address',
      onChangeCallback: setPhysicalSameAsMailing,
    },
  ];

  if (!physicalSameAsMailing) {
    formFields = [
      ...formFields,
      {
        type: FormationsFormFields.Text,
        name: 'physicalAddress1',
        placeholder: '1234 Ave E',
        label: 'Address Line 1',
      },
      {
        type: FormationsFormFields.Text,
        name: 'physicalAddress2',
        placeholder: '',
        label: 'Address Line 2',
      },
      {
        type: FormationsFormFields.Text,
        name: 'physicalCity',
        placeholder: 'Seattle',
        label: 'City',
      },
      {
        type: FormationsFormFields.AutoComplete,
        name: 'physicalState',
        placeholder: 'Washington',
        label: 'State',
        options: STATES,
      },
      {
        type: FormationsFormFields.ZipCode,
        name: 'physicalZip',
        placeholder: '12345',
        label: 'Zip Code',
      },
    ];
  }

  return (
    <div>
      <Grid container direction="column">
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Business Address
          </Typography>
          <Button
            aria-label="delete"
            sx={{ marginLeft: '24px' }}
            startIcon={<EditIcon />}
            onClick={() => setShowEditModal(true)}
            data-testid="business-address-edit-btn"
          >
            Edit
          </Button>
        </Grid>
        {companyData?.contactDetails && (
          <BusinessAddressView contactDetails={companyData?.contactDetails} />
        )}
      </Grid>
      {showEditModal && (
        <FormationsFormDialog
          title="Edit Business Address"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          fieldsMap={formFields}
          defaultValues={{
            mailingAddress1,
            mailingAddress2,
            mailingCity,
            mailingState:
              STATES.find((item) => item.code === mailingState) || null,
            mailingZip,
            workPhone: contactDetails?.workPhone,
            physicalSameAsMailing,
            physicalAddress1,
            physicalAddress2,
            physicalCity,
            physicalState:
              STATES.find((item) => item.code === physicalState) || null,
            physicalZip,
            mode: 'onSubmit',
            reValidateMode: 'onChange',
          }}
          validationSchema={businessAddressSchema}
        />
      )}
    </div>
  );
};
