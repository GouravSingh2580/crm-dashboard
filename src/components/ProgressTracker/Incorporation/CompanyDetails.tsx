import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Button, Box } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import queryClient from 'states/reactQueryClient';
import { ReadOnlyForm } from 'components/common/ReadOnlyForm';
import {
  companyDetailsCustomerStep1,
  companyDetailsCustomerStep2,
  BUSINESS_DESCRIPTION_LIMIT,
} from 'schemas/companyDetailsSchema';
import {
  FormationsForm,
  FormationsFormFields,
} from 'components/common/FormationsForm';
import { UIDateFormat } from 'helpers/dateTimeFormat';
import { ProgressTrackerStatus } from 'services/account';
import { Company } from 'models/company';
import { ENTITY_MAPPING } from 'constants/common';
import { useUpdateCompany } from 'hooks/api';
import { BUSINESS_INDUSTRIES, STATES } from '../../../enums';

const useStyles = makeStyles((theme) => ({
  textSecondary: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  securedTextField: {
    '& input': {
      fontFamily: 'password',
    },
  },
}));



const solePropStep1Fields = [
  {
    type: FormationsFormFields.Suggested,
    name: 'suggested',
    placeholder: 'Company Name',
    autoCapitalize: true,
    label: 'Company Name',
    maxLength: 80,
  },
];

interface TParams {
  handleComplete: (status: ProgressTrackerStatus) => void;
  stageCompleted: boolean;
  companyData: Company;
  status: ProgressTrackerStatus | null;
}

export const CompanyDetails = ({
  handleComplete,
  stageCompleted,
  companyData,
  status,
}: TParams) => {
  const [formStep, setFormStep] = useState(0);
   const [disabled, setDisabled] = useState(false);
   const isScorp = companyData?.entityType==="S-CORP"
  let  step1Fields = [
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
      label: 'Date of Incorporation',
      readOnly: disabled
    },
    {
      type: FormationsFormFields.Text,
      name: 'ein',
      placeholder: '123456789',
      maxLength: 9,
      label: 'Employer Identification Number (EIN)',
      readOnly: disabled
    }
  ];
  const conditionalFields = [  
    {
      type: FormationsFormFields.SameAsAbove,
      name: 'hasEinNo',
      label: 'I have not received my EIN yet',
      onChangeCallback: ()=>{ setDisabled(!disabled)}
    }
  ]
  step1Fields = isScorp ? step1Fields : [...step1Fields, ...conditionalFields]
  const classes = useStyles();
  const isSoleProp = companyData?.entityType === ENTITY_MAPPING.sole_prop;

  const { mutateAsync: updateCompany } = useUpdateCompany({
    onSuccess: () => {
      queryClient.invalidateQueries(['getCompany', companyData?.id]);
    },
  });

  const onStep1Submit = async (formData: Company) => {
    const companyDetails = {
      suggestedNames: isSoleProp
        ? formData?.suggested?.filter((name) => name)
        : undefined,
      name: formData?.name || undefined,
      incorporationDate: formData?.incorporationDate
        ? UIDateFormat(formData?.incorporationDate)
        : undefined,
      ein: formData.ein || undefined,
      hasEinNo: !formData.hasEinNo
    };
    if(formData && formData.hasEinNo){
      companyDetails.ein = undefined;
    }
    if (companyData?.id) {
      await updateCompany({ id: companyData.id, data: companyDetails });
      setFormStep(1);
      if (status === null) {
        handleComplete(ProgressTrackerStatus.Started);
      }
    }
  };

  const onStep2Submit = async (formData: Company) => {
    const companyDetails = {
      industry: formData.industry?.code,
      stateOfIncorporation: formData.stateOfIncorporation?.code,
      description: formData.description,
    };
    if (companyData?.id) {
      await updateCompany({ id: companyData.id, data: companyDetails });
      if (ProgressTrackerStatus.Completed !== status) {
        handleComplete(ProgressTrackerStatus.Completed);
      }
    }
  };

  const step1FieldMap = isSoleProp ? solePropStep1Fields : step1Fields;

  const subHeading = isSoleProp
    ? "Now, let's get to know your business. It's time to name your new LLC! We'll need at least 3 options in case your first and second choices are already taken."
    : "Tell us more about your industry, what state you're operating in, and what your business is all about.";

  return (
    <div>
      <Typography variant="h5B" component="h5" data-test-id="company-details">
        Company Details
      </Typography>
      {stageCompleted ? (
        <ReadOnlyForm
          items={[
            {
              title: 'Company Name',
              value:
                companyData?.name ||
                companyData?.suggested?.map(
                  (item: any) => item?.name ?? item,
                ) ||
                '',
            },
            {
              title: 'Date of Incorporation',
              value: companyData?.incorporationDate,
            },
            {
              title: 'Employer Identification Number (EIN)',
              value: companyData?.ein,
            },
            {
              title: 'State of Incorporation',
              value: companyData?.stateOfIncorporation,
            },
            {
              title: 'Business Industry',
              value: companyData?.industry,
            },
            {
              title: 'Business Description',
              value: companyData?.description,
            },
          ]}
        />
      ) : (
        <>
          <Box
            sx={{
              display: formStep === 0 ? 'block' : 'none',
            }}
          >
            <Typography variant="body1" className={classes.textSecondary}>
              {subHeading}
            </Typography>
            <FormationsForm
              onSubmit={onStep1Submit}
              defaultValues={{
                name: companyData.name,
                suggested: companyData?.suggested
                  ? companyData.suggested.map((item: any) => item?.name ?? item)
                  : ['', '', ''],
                incorporationDate: companyData.incorporationDate || null,
                ein: companyData.ein,
                hasEinNo: companyData.hasEinNo || false
              }}
              fieldsMap={step1FieldMap}
              validationSchema={companyDetailsCustomerStep1}
              formContext={{
                isSoleProp,
              }}
              renderFormControls={({ isSubmitting }) => (
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  size="large"
                  data-testid="save-step-1"
                  loading={isSubmitting}
                  loadingPosition="end"
                  endIcon={<SaveIcon />}
                >
                  Save and Continue
                </LoadingButton>
              )}
              showLoader={false}
            />
          </Box>
          <Box
            sx={{
              display: formStep === 1 ? 'block' : 'none',
            }}
          >
            <Typography variant="body1" className={classes.textSecondary}>
              Now tell us what business industry you are in, the state of
              incorporation, and provide a brief business description.
            </Typography>
            <FormationsForm
              onSubmit={onStep2Submit}
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
              defaultValues={{
                stateOfIncorporation:
                  STATES.find(
                    (item) => item.code === companyData.stateOfIncorporation,
                  ) || null,
                industry:
                  BUSINESS_INDUSTRIES.find(
                    (item) => item.code === companyData.industry,
                  ) || null,
                description: companyData.description || '',
              }}
              fieldsMap={[
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
              ]}
              validationSchema={companyDetailsCustomerStep2}
              formContext={{}}
              renderFormControls={({ isSubmitting }) => (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    type="button"
                    variant="text"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={() => setFormStep((prev) => prev - 1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="outlined"
                    size="large"
                    data-testid="save-step-2"
                    loading={isSubmitting}
                    loadingPosition="end"
                    endIcon={<SaveIcon />}
                  >
                    Save and Continue
                  </LoadingButton>
                </Box>
              )}
              showLoader={false}
            />
          </Box>
        </>
      )}
    </div>
  );
};
