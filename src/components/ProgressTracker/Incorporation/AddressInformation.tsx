import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import queryClient from 'states/reactQueryClient';
import { businessAddressSchema } from 'schemas/businessAddressSchema';
import { BusinessAddressView } from 'views/BusinessAddressView';
import {
  FormationsForm,
  FormationsFormFields,
} from 'components/common/FormationsForm';
import { useUpdateCompany } from 'hooks/api';
import { Company } from 'models/company';
import { STATES } from '../../../enums';

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    color: theme.palette.text.secondary,
  },
}));

const defaultAddress = {
  street1: '',
  street2: '',
  city: '',
  state: '',
  zip: '',
};

interface TParams {
  handleComplete: () => void;
  stageCompleted: boolean;
  companyData: Company
}

export const AddressInformation = ({
  handleComplete,
  stageCompleted,
  companyData
}: TParams) => {
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const { contactDetails } = companyData || {};

  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: () => {
      queryClient.invalidateQueries(['getCompany', companyData?.id]);
    },
  });

  const {
    street1: physicalAddress1,
    street2: physicalAddress2,
    city: physicalCity,
    state: physicalState,
    zip: physicalZip,
  } = contactDetails?.physicalAddress || defaultAddress;

  const {
    street1: mailingAddress1,
    street2: mailingAddress2,
    city: mailingCity,
    state: mailingState,
    zip: mailingZip,
  } = contactDetails?.mailingAddress || defaultAddress;

  const [physicalSameAsMailing, setPhysicalSameAsMailing] = useState(true);

  let formFields = [
    {
      type: FormationsFormFields.Text,
      name: 'mailingAddress1',
      placeholder: '1234 Ave E',
      label: 'Address Line 1',
      autoFocus: true,
      maxLength: 250,
    },
    {
      type: FormationsFormFields.Text,
      name: 'mailingAddress2',
      placeholder: '',
      label: 'Address Line 2',
      maxLength: 250,
    },
    {
      type: FormationsFormFields.Text,
      name: 'mailingCity',
      placeholder: 'Seattle',
      label: 'City',
      maxLength: 50,
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
        maxLength: 250,
      },
      {
        type: FormationsFormFields.Text,
        name: 'physicalAddress2',
        placeholder: '',
        label: 'Address Line 2',
        maxLength: 250,
      },
      {
        type: FormationsFormFields.Text,
        name: 'physicalCity',
        placeholder: 'Seattle',
        label: 'City',
        maxLength: 50,
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

  const onFormSubmit = async (formData: { [key: string]: string }) => {
    setSubmitting(true);
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

    if (companyData?.id) {
      await updateCompany({ id: companyData.id, data: address });
      handleComplete();
    }
  };

  return (
    <div>
      <Typography variant="h5B" component="h5" data-test-id="address-details">
        Business Address
      </Typography>
      {stageCompleted && contactDetails && (
        <BusinessAddressView contactDetails={contactDetails} />
      )}
      {!stageCompleted && (
        <>
          <Typography variant="body1" className={classes.textSecondary}>
            Where would you like to receive business-related mail?
          </Typography>
          <FormationsForm
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
            renderFormControls={() => (
              <LoadingButton
                type="submit"
                variant="outlined"
                size="large"
                data-testid="save-address"
                loading={submitting}
                loadingPosition="end"
                endIcon={<SaveIcon />}
              >
                Save and Continue
              </LoadingButton>
            )}
            showLoader={false}
          />
        </>
      )}
    </div>
  );
};
