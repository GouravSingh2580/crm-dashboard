import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Grid, Typography } from '@mui/material';
import { FormationsFormDialog } from 'components/common/FormationsFormDialog';
import queryClient from 'states/reactQueryClient';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import { Company } from 'services/companies';
import { useUpdateCompany } from 'hooks/api/useCompanies';
import {
  BUSINESS_DESCRIPTION_LIMIT,
  adminCompanyDetailSchema,
} from 'schemas/companyDetailsSchema';
import { FormationsFormFields } from 'components/common/FormationsForm';
import { BUSINESS_INDUSTRIES, STATES } from 'enums';
import { ENTITY_MAPPING } from 'constants/common';

interface ICompanyDetailsViewProps {
  isSoleProp: boolean;
  companyData: any;
  userData: any;
  handleComplete: () => void;
}

const formFields = [
  {
    type: FormationsFormFields.Text,
    name: 'name',
    placeholder: 'Company Name',
    autoCapitalize: true,
    label: 'Company Name',
    autoFocus: true,
    maxLength: 80,
  },
  {
    type: FormationsFormFields.Date,
    name: 'incorporationDate',
    placeholder: 'MM/DD/YYYY',
    label: 'Date Of Incorporation',
  },
  {
    type: FormationsFormFields.Text,
    name: 'ein',
    placeholder: '123456789',
    maxLength: 9,
    label: 'Employer Identification Number (EIN)',
  },
  {
    type: FormationsFormFields.AutoComplete,
    name: 'stateOfIncorporation',
    placeholder: 'Washington',
    label: 'State of Incorporation',
    options: STATES,
  },
  {
    type: FormationsFormFields.AutoComplete,
    name: 'industry',
    placeholder: '',
    label: 'Business Industry',
    options: BUSINESS_INDUSTRIES,
  },
  {
    type: FormationsFormFields.TextArea,
    name: 'description',
    label: 'Business Description',
    placeholder: 'Individual and Family Psychotherapy Practice',
    characterLimit: BUSINESS_DESCRIPTION_LIMIT,
  },
];

const solePropFormFields = [
  {
    type: FormationsFormFields.Suggested,
    name: 'suggested',
    placeholder: 'Company Name',
    autoCapitalize: true,
    label: 'Company Name',
    maxLength: 80,
  },
  {
    type: FormationsFormFields.AutoComplete,
    name: 'stateOfIncorporation',
    placeholder: 'Washington',
    label: 'State of Incorporation',
    options: STATES,
  },
  {
    type: FormationsFormFields.AutoComplete,
    name: 'industry',
    placeholder: '',
    label: 'Business Industry',
    options: BUSINESS_INDUSTRIES,
  },
  {
    type: FormationsFormFields.TextArea,
    name: 'description',
    label: 'Business Description',
    placeholder: 'Individual and Family Psychotherapy Practice',
    characterLimit: BUSINESS_DESCRIPTION_LIMIT,
  },
];

export const CompanyDetailsView: React.FC<ICompanyDetailsViewProps> = ({
  isSoleProp,
  companyData,
  userData,
  handleComplete,
}) => {
  const {
    name,
    suggested,
    industry,
    description,
    ein,
    incorporationDate,
    stateOfIncorporation,
  } = companyData;

  const [showEditModal, setShowEditModal] = React.useState(false);

  const { mutateAsync: UpdateCompany } = useUpdateCompany({
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'company/user',
        'userid',
        userData.id,
      ]);
      setShowEditModal(false);
    },
  });

  const onFormSubmit = async (formData: Company) => {
    const companyDetails = {
      ein: formData?.ein,
      name: formData?.name,
      incorporationDate: formData?.incorporationDate,
      description: formData.description,
      industry: formData.industry?.code,
      suggestedNames: formData?.suggested,
      stateOfIncorporation: formData.stateOfIncorporation?.code,
    };

    await UpdateCompany({ id: companyData.id, data: companyDetails });
    handleComplete();
  };

  return (
    <div>
      <Grid container direction="column">
        <Grid container direction="row" alignItems="baseline" rowGap={2}>
          <Typography variant="h5B" component="span">
            Company Details
          </Typography>
          <Button
            aria-label="delete"
            sx={{ marginLeft: '24px' }}
            startIcon={<EditIcon />}
            data-testid="company-detail-edit-btn"
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>
        </Grid>
        <ReadOnlyForm
          items={[
            {
              title: 'Company Name',
              value:
                companyData?.entityType !== ENTITY_MAPPING.sole_prop
                  ? name
                  : suggested?.map((item: any) => item?.name ?? item) || '',
            },
            {
              title: 'Date of Incorporation',
              value: incorporationDate,
            },
            {
              title: 'Employer Identification Number (EIN)',
              value: ein,
            },
            {
              title: 'State of Incorporation',
              value: stateOfIncorporation,
            },
            {
              title: 'Business Industry',
              value: industry,
            },
            {
              title: 'Business Description',
              value: description,
            },
          ]}
        />
      </Grid>
      {showEditModal && (
        <FormationsFormDialog
          title="Edit Company Detail"
          isOpen={showEditModal}
          onChange={(fieldName, data, setValue) => {
            if (fieldName === 'industry' && data?.industry) {
              setValue(
                'description',
                data?.industry?.defaultDescription || '',
                {
                  shouldDirty: false,
                },
              );
            }
          }}
          onClose={() => setShowEditModal(false)}
          onSubmit={onFormSubmit}
          fieldsMap={isSoleProp ? solePropFormFields : formFields}
          defaultValues={{
            name,
            ein,
            incorporationDate: incorporationDate || null,
            suggested:
              companyData?.suggested?.length !== 0
                ? companyData.suggested.map((item: any) => item?.name ?? item)
                : ['', '', ''],
            stateOfIncorporation:
              STATES.find((item) => item.code === stateOfIncorporation) || null,
            industry:
              BUSINESS_INDUSTRIES.find((item) => item.code === industry) ||
              null,
            description,
            mode: 'onChange',
            reValidateMode: 'onChange',
          }}
          validationSchema={adminCompanyDetailSchema}
          formContext={{ isSoleProp }}
        />
      )}
    </div>
  );
};
